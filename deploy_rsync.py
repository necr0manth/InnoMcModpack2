"""Manifest-based rsync deployment for server and AutoModpack client packs."""

from __future__ import annotations

import os
import shlex
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path

from deploy_common import SCOPES, Scope, manifest_bytes, parse_manifest, plan_scope, scan_builds


def _remote_manifest_path(target: str, name: str) -> str:
    return target.rstrip("/") + "/" + name


def _ssh_base(host: str, user: str, port: str) -> list[str]:
    return [
        "sshpass", "-e", "ssh", "-p", port,
        "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null",
        "-o", "ConnectTimeout=15", "-o", "ServerAliveInterval=30", f"{user}@{host}",
    ]


def _run(args: list[str], env: dict[str, str], *, capture: bool = False, check: bool = True):
    return subprocess.run(args, env=env, check=check, text=True, capture_output=capture)


def _read_remote_manifest(ssh: list[str], env: dict[str, str], target: str, scope: Scope) -> dict:
    names = [scope.manifest_name]
    if scope.legacy_manifest_name:
        names.append(scope.legacy_manifest_name)
    for name in names:
        path = _remote_manifest_path(target, name)
        command = f"LC_ALL=C cat -- {shlex.quote(path)}"
        result = _run(ssh + [command], env, capture=True, check=False)
        if result.returncode != 0:
            if "No such file or directory" in result.stderr:
                continue
            raise RuntimeError(f"Could not read {scope.name} manifest {path}: {result.stderr.strip()}")
        return parse_manifest(result.stdout, scope)
    return {}


def _destination(user: str, host: str, remote_path: str) -> str:
    return f"{user}@{host}:{remote_path}"


def _mkdir(ssh: list[str], env: dict[str, str], path: str) -> None:
    _run(ssh + [f"mkdir -p -- {shlex.quote(path)}"], env)


def _delete(ssh: list[str], env: dict[str, str], path: str) -> None:
    # rm -f succeeds for a missing path, but still fails on permission/network errors.
    _run(ssh + [f"rm -f -- {shlex.quote(path)}"], env)


def _rsync_command(
    user: str, host: str, port: str, source: str, destination: str,
    file_list: str, env: dict[str, str], full: bool,
) -> None:
    ssh_transport = f"ssh -p {shlex.quote(port)} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
    command = [
        "sshpass", "-e", "rsync", "-avzc", "--no-perms", "--timeout=60",
        "--from0", f"--files-from={file_list}", "-s", "-e", ssh_transport,
    ]
    if full:
        command.append("--ignore-times")
    command.extend([source.rstrip(os.sep) + os.sep, _destination(user, host, destination)])
    _run(command, env)


def deploy(
    host: str, user: str, port: str, target: str, password: str,
    full: bool = False, project_root: Path | str = ".",
) -> None:
    current = scan_builds(project_root)
    env = os.environ.copy()
    env["SSHPASS"] = password
    ssh = _ssh_base(host, user, port)
    previous = {scope.name: _read_remote_manifest(ssh, env, target, scope) for scope in SCOPES}
    plans = {
        scope.name: plan_scope(scope, current[scope.name], previous[scope.name], full)
        for scope in SCOPES
    }

    remote_roots = {
        scope.name: target.rstrip("/") if scope.remote_relative_dir == "."
        else target.rstrip("/") + "/" + scope.remote_relative_dir
        for scope in SCOPES
    }
    for scope in SCOPES:
        _mkdir(ssh, env, remote_roots[scope.name])

    with tempfile.TemporaryDirectory(prefix="automodpack-deploy-") as temp_dir:
        temp_root = Path(temp_dir)
        for scope in SCOPES:
            uploads, _ = plans[scope.name]
            if not uploads:
                continue
            file_list = temp_root / f"{scope.name}-files-from.bin"
            file_list.write_bytes(b"\0".join(path.encode("utf-8") for path in uploads) + b"\0")
            source = str(Path(project_root) / scope.local_dir)
            _rsync_command(user, host, port, source, remote_roots[scope.name], str(file_list), env, full)

        for scope in SCOPES:
            _, deletes = plans[scope.name]
            for relative in deletes:
                remote = remote_roots[scope.name] + "/" + relative
                _delete(ssh, env, remote)

        # Data operations for both scopes finish before either success manifest is replaced.
        for scope in SCOPES:
            final_path = _remote_manifest_path(target, scope.manifest_name)
            temporary_path = final_path + ".tmp-" + uuid.uuid4().hex
            local_manifest = temp_root / f"{scope.name}-manifest.json"
            local_manifest.write_bytes(manifest_bytes(current[scope.name]))
            try:
                command = [
                    "sshpass", "-e", "rsync", "-avz", "-e",
                    f"ssh -p {shlex.quote(port)} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null",
                    str(local_manifest), _destination(user, host, temporary_path),
                ]
                _run(command, env)
                _run(ssh + [f"mv -f -- {shlex.quote(temporary_path)} {shlex.quote(final_path)}"], env)
            except Exception:
                _run(ssh + [f"rm -f -- {shlex.quote(temporary_path)}"], env, check=False)
                raise


def main() -> int:
    host, user = os.environ.get("SFTP_HOST"), os.environ.get("SFTP_USER")
    password, target = os.environ.get("SFTP_PASS"), os.environ.get("TARGET_DIR")
    port = os.environ.get("SFTP_PORT", "22")
    try:
        if not all((host, user, password, target)):
            raise ValueError("Missing required SFTP_HOST, SFTP_USER, SFTP_PASS, or TARGET_DIR")
        if not target.startswith("/") or target == "/":
            raise ValueError("TARGET_DIR must be an absolute, non-root remote path")
        if not port.isdigit() or not (1 <= int(port) <= 65535):
            raise ValueError("SFTP_PORT must be between 1 and 65535")
        # Local validation completes before SSH or any remote mutation.
        scan_builds()
        deploy(host, user, port, target, password, os.environ.get("FORCE_FULL", "false").lower() == "true")
        print("Deployment complete.")
        return 0
    except Exception as error:
        print(f"Deployment failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
