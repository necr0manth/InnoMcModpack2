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

from deploy_common import (
    SCOPES, Scope, manifest_bytes, parse_manifest, plan_deployment,
    read_settings, remote_path, remote_root, scan_builds,
)


logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S")
logger = logging.getLogger("DeploySFTP")


def _is_missing(error: BaseException) -> bool:
    return isinstance(error, FileNotFoundError) or getattr(error, "errno", None) == errno.ENOENT or (
        bool(getattr(error, "args", ())) and getattr(error, "args")[0] == errno.ENOENT
    )


def read_previous(sftp, target: str, scope: Scope) -> dict:
    path = remote_path(target, scope.manifest_name)
    try:
        with sftp.open(path, "rb") as remote:
            data = remote.read()
    except Exception as error:
        if not _is_missing(error):
            raise RuntimeError(f"Could not read {scope.name} manifest {path}: {error}") from error
        if scope.legacy_manifest_name is None:
            return {}
        legacy = remote_path(target, scope.legacy_manifest_name)
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
    final_path = remote_path(target, scope.manifest_name)
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


def deploy(sftp, target: str, full: bool = False, project_root: Path | str = ".", *, current: dict | None = None) -> None:
    if current is None:
        current = scan_builds(project_root)
    previous = {scope.name: read_previous(sftp, target, scope) for scope in SCOPES}
    plans = plan_deployment(current, previous, full)

    remote_roots = {scope.name: remote_root(target, scope) for scope in SCOPES}
    for scope in SCOPES:
        uploads, _ = plans[scope.name]
        local_root = Path(project_root) / scope.local_dir
        for relative in uploads:
            destination = remote_path(remote_roots[scope.name], relative)
            logger.info("Uploading %s/%s", scope.name, relative)
            _upload_atomically(sftp, local_root / Path(*relative.split("/")), destination)

    for scope in SCOPES:
        _, deletes = plans[scope.name]
        for relative in deletes:
            destination = remote_path(remote_roots[scope.name], relative)
            logger.info("Deleting stale %s/%s", scope.name, relative)
            _remove_if_present(sftp, destination)

    # Publish only after every upload and stale deletion in both scopes succeeds.
    for scope in SCOPES:
        _publish_manifest(sftp, target, scope, current[scope.name])


def main() -> int:
    try:
        settings = read_settings(allow_root=True)
        current = scan_builds()
    except Exception as error:
        logger.error("Preflight failed: %s", error)
        return 1

    import paramiko

    transport = None
    try:
        transport = paramiko.Transport((settings.host, settings.port))
        transport.set_keepalive(15)
        transport.default_window_size = 8192
        transport.default_max_packet_size = 1024
        transport.connect(username=settings.user, password=settings.password)
        sftp = paramiko.SFTPClient.from_transport(transport)
        deploy(sftp, settings.target, settings.full, current=current)
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
