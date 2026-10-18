"""Shared, safety-critical planning for server and AutoModpack deployments."""

from __future__ import annotations

import hashlib
import json
import os
import re
import stat
from dataclasses import dataclass
from pathlib import Path


MANIFEST_NAMES = {"deploy_manifest.json", "deploy_server_manifest.json", "deploy_client_manifest.json"}
MD5_RE = re.compile(r"^[0-9a-f]{32}$")


@dataclass(frozen=True)
class Scope:
    name: str
    local_dir: str
    remote_relative_dir: str
    manifest_name: str
    legacy_manifest_name: str | None = None


SCOPES = (
    Scope("server", "build/server", ".", "deploy_server_manifest.json", "deploy_manifest.json"),
    Scope("client", "build/client", "automodpack/host-modpack/main", "deploy_client_manifest.json"),
)


def safe_relative_path(value: object) -> bool:
    if not isinstance(value, str) or not value or "\\" in value or value.startswith("/") or "\x00" in value:
        return False
    parts = value.split("/")
    return all(part not in ("", ".", "..") for part in parts)


def is_protected(scope: Scope, path: str) -> bool:
    if path in MANIFEST_NAMES:
        return True
    if scope.name == "server":
        return path == "automodpack" or path.startswith("automodpack/")
    return (
        path == "automodpack" or path.startswith("automodpack/")
        or (path.startswith("mods/") and Path(path).name.startswith("automodpack-") and Path(path).suffix.lower() == ".jar")
    )


def _hash_file(path: Path) -> str:
    digest = hashlib.md5()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def scan_build(scope: Scope, project_root: Path | str = ".") -> dict[str, dict[str, int | str]]:
    root = Path(project_root) / scope.local_dir
    if root.is_symlink() or not root.is_dir():
        raise ValueError(f"Required {scope.name} build directory is missing or is a symlink: {root}")
    mods = root / "mods"
    if mods.is_symlink() or not mods.is_dir():
        raise ValueError(f"Required {scope.name} build has no real mods/ directory: {root}")

    state: dict[str, dict[str, int | str]] = {}
    has_mod_jar = False
    for current, directories, files in os.walk(root, followlinks=False):
        current_path = Path(current)
        for directory in directories:
            entry = current_path / directory
            if entry.is_symlink():
                raise ValueError(f"Unsupported symlink in {scope.name} build: {entry}")
        for filename in files:
            entry = current_path / filename
            info = entry.lstat()
            if not stat.S_ISREG(info.st_mode):
                raise ValueError(f"Unsupported non-regular file in {scope.name} build: {entry}")
            relative = entry.relative_to(root).as_posix()
            if not safe_relative_path(relative):
                raise ValueError(f"Unsafe file path in {scope.name} build: {relative!r}")
            if relative.startswith("mods/") and entry.suffix.lower() == ".jar":
                has_mod_jar = True
            if is_protected(scope, relative):
                continue
            state[relative] = {"hash": _hash_file(entry), "size": info.st_size}

    if not state or not has_mod_jar:
        raise ValueError(f"{scope.name} build must contain files and at least one mod JAR: {root}")
    return state


def scan_builds(project_root: Path | str = ".") -> dict[str, dict[str, dict[str, int | str]]]:
    # Complete both scans before a caller is allowed to mutate a remote.
    return {scope.name: scan_build(scope, project_root) for scope in SCOPES}


def validate_manifest(raw: object, scope: Scope) -> dict[str, dict[str, int | str]]:
    if not isinstance(raw, dict):
        raise ValueError(f"{scope.name} manifest must be a JSON object")
    result: dict[str, dict[str, int | str]] = {}
    for path, value in raw.items():
        if not safe_relative_path(path):
            raise ValueError(f"Unsafe path in {scope.name} manifest: {path!r}")
        if not isinstance(value, dict) or set(value) != {"hash", "size"}:
            raise ValueError(f"Invalid manifest entry for {path!r}")
        digest, size = value["hash"], value["size"]
        if not isinstance(digest, str) or not MD5_RE.fullmatch(digest):
            raise ValueError(f"Invalid MD5 hash for {path!r}")
        if isinstance(size, bool) or not isinstance(size, int) or size < 0:
            raise ValueError(f"Invalid file size for {path!r}")
        if not is_protected(scope, path):
            result[path] = {"hash": digest, "size": size}
    return result


def parse_manifest(data: bytes | str, scope: Scope) -> dict[str, dict[str, int | str]]:
    try:
        return validate_manifest(json.loads(data), scope)
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise ValueError(f"Invalid JSON in {scope.name} manifest: {exc}") from exc


def plan_scope(
    scope: Scope,
    current: dict[str, dict[str, int | str]],
    previous: dict[str, dict[str, int | str]],
    full: bool,
) -> tuple[list[str], list[str]]:
    current = validate_manifest(current, scope)
    previous = validate_manifest(previous, scope)
    uploads = [path for path, info in current.items() if full or previous.get(path, {}).get("hash") != info["hash"]]
    deletes = sorted(path for path in previous if path not in current)
    return sorted(uploads), deletes


def manifest_bytes(state: dict[str, dict[str, int | str]]) -> bytes:
    return (json.dumps(state, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")
