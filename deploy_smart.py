"""Manifest-based SFTP deployment for server and AutoModpack client packs."""

from __future__ import annotations

import errno
import logging
import os
import posixpath
import sys
import tempfile
import uuid
from pathlib import Path

from deploy_common import SCOPES, Scope, manifest_bytes, parse_manifest, plan_scope, scan_builds


logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S")
logger = logging.getLogger("DeploySmart")


def _is_missing(error: BaseException) -> bool:
    return isinstance(error, FileNotFoundError) or getattr(error, "errno", None) == errno.ENOENT or (
        bool(getattr(error, "args", ())) and getattr(error, "args")[0] == errno.ENOENT
    )


def _remote_manifest_path(target: str, name: str) -> str:
    return posixpath.join(target.rstrip("/"), name)


def read_previous(sftp, target: str, scope: Scope) -> dict:
    path = _remote_manifest_path(target, scope.manifest_name)
    try:
        with sftp.open(path, "rb") as remote:
            data = remote.read()
    except Exception as error:
        if not _is_missing(error):
            raise RuntimeError(f"Could not read {scope.name} manifest {path}: {error}") from error
        if scope.legacy_manifest_name is None:
            return {}
        legacy = _remote_manifest_path(target, scope.legacy_manifest_name)
        try:
            with sftp.open(legacy, "rb") as remote:
                data = remote.read()
        except Exception as legacy_error:
            if _is_missing(legacy_error):
                return {}
            raise RuntimeError(f"Could not read legacy server manifest {legacy}: {legacy_error}") from legacy_error
    return parse_manifest(data, scope)


def _ensure_remote_dir(sftp, path: str) -> None:
    current = ""
    for part in path.split("/"):
        if not part:
            continue
        current += "/" + part
        try:
            sftp.stat(current)
        except Exception as error:
            if not _is_missing(error):
                raise
            sftp.mkdir(current)


def _upload(sftp, local: Path, remote: str) -> None:
    _ensure_remote_dir(sftp, posixpath.dirname(remote))
    with local.open("rb") as source, sftp.open(remote, "wb") as destination:
        while chunk := source.read(16 * 1024):
            destination.write(chunk)


def _upload_atomically(sftp, local: Path, remote: str) -> None:
    temporary = remote + ".tmp-" + uuid.uuid4().hex
    try:
        _upload(sftp, local, temporary)
        sftp.posix_rename(temporary, remote)
    except Exception:
        try:
            sftp.remove(temporary)
        except Exception:
            pass
        raise


def _remove_if_present(sftp, remote: str) -> None:
    try:
        sftp.remove(remote)
    except Exception as error:
        if not _is_missing(error):
            raise


def _publish_manifest(sftp, target: str, scope: Scope, state: dict) -> None:
    final_path = _remote_manifest_path(target, scope.manifest_name)
    _ensure_remote_dir(sftp, posixpath.dirname(final_path))
    temp_path = final_path + ".tmp-" + uuid.uuid4().hex
    local_name = None
    try:
        with tempfile.NamedTemporaryFile(prefix="deploy-manifest-", suffix=".json", delete=False) as local:
            local_name = local.name
            local.write(manifest_bytes(state))
        _upload(sftp, Path(local_name), temp_path)
        # Requires the server's POSIX rename extension to atomically replace an
        # existing canonical manifest. Failure is surfaced; no truncated file.
        sftp.posix_rename(temp_path, final_path)
    except Exception:
        try:
            sftp.remove(temp_path)
        except Exception:
            pass
        raise
    finally:
        if local_name:
            os.unlink(local_name)


def deploy(sftp, target: str, full: bool = False, project_root: Path | str = ".") -> None:
    current = scan_builds(project_root)
    previous = {scope.name: read_previous(sftp, target, scope) for scope in SCOPES}
    plans = {
        scope.name: plan_scope(scope, current[scope.name], previous[scope.name], full)
        for scope in SCOPES
    }

    for scope in SCOPES:
        uploads, _ = plans[scope.name]
        local_root = Path(project_root) / scope.local_dir
        remote_root = target.rstrip("/") if scope.remote_relative_dir == "." else posixpath.join(target.rstrip("/"), scope.remote_relative_dir)
        for relative in uploads:
            remote_path = posixpath.join(remote_root, relative)
            logger.info("Uploading %s/%s", scope.name, relative)
            _upload_atomically(sftp, local_root / Path(*relative.split("/")), remote_path)

    for scope in SCOPES:
        _, deletes = plans[scope.name]
        remote_root = target.rstrip("/") if scope.remote_relative_dir == "." else posixpath.join(target.rstrip("/"), scope.remote_relative_dir)
        for relative in deletes:
            remote_path = posixpath.join(remote_root, relative)
            logger.info("Deleting stale %s/%s", scope.name, relative)
            _remove_if_present(sftp, remote_path)

    # Publish only after every upload and stale deletion in both scopes succeeds.
    for scope in SCOPES:
        _publish_manifest(sftp, target, scope, current[scope.name])


def main() -> int:
    host, user = os.environ.get("SFTP_HOST"), os.environ.get("SFTP_USER")
    password, target = os.environ.get("SFTP_PASS"), os.environ.get("TARGET_DIR")
    try:
        port = int(os.environ.get("SFTP_PORT", "22"))
        if not 1 <= port <= 65535:
            raise ValueError("SFTP_PORT must be between 1 and 65535")
        if not all((host, user, password, target)):
            raise ValueError("Missing required SFTP_HOST, SFTP_USER, SFTP_PASS, or TARGET_DIR")
        if target is None or not target.startswith("/") or target == "/":
            raise ValueError("TARGET_DIR must be an absolute, non-root remote path")
        current = scan_builds()
    except Exception as error:
        logger.error("Preflight failed: %s", error)
        return 1

    import paramiko

    transport = None
    try:
        transport = paramiko.Transport((host, port))
        transport.set_keepalive(15)
        transport.default_window_size = 8192
        transport.default_max_packet_size = 1024
        transport.connect(username=user, password=password)
        sftp = paramiko.SFTPClient.from_transport(transport)
        # Avoid rescanning after connection while keeping deploy() convenient for tests.
        deploy(sftp, target, os.environ.get("FORCE_FULL", "false").lower() == "true")
        sftp.close()
        logger.info("Deployment complete.")
        return 0
    except Exception as error:
        logger.exception("Deployment failed: %s", error)
        return 1
    finally:
        if transport:
            transport.close()


if __name__ == "__main__":
    sys.exit(main())
