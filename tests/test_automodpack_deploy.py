import json
import os
import tempfile
import unittest
from contextlib import chdir
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import deploy_common
import deploy_rsync
import deploy_sftp


def entry(data):
    import hashlib

    return {"hash": hashlib.md5(data).hexdigest(), "size": len(data)}


def make_builds(root):
    for name in ("server", "client"):
        base = root / "build" / name
        (base / "mods").mkdir(parents=True)
        (base / "mods/common.jar").write_bytes(b"common")
        (base / "config").mkdir()
        (base / "config/example.cfg").write_bytes(b"config")
    (root / "build/client/mods/client-only.jar").write_bytes(b"client-only")
    (root / "build/client/mods/automodpack-5.0.0-rc.4.jar").write_bytes(b"bootstrap")
    (root / "build/client/automodpack/client.conf").parent.mkdir()
    (root / "build/client/automodpack/client.conf").write_text("bootstrap", encoding="utf-8")


class MemoryFile:
    def __init__(self, sftp, path, mode):
        self.sftp, self.path, self.mode = sftp, path, mode
        self.buffer = bytearray()

    def __enter__(self):
        if "r" in self.mode:
            if self.path not in self.sftp.files:
                raise FileNotFoundError(self.path)
            return self
        return self

    def __exit__(self, *_):
        if "w" in self.mode:
            self.sftp.files[self.path] = bytes(self.buffer)

    def read(self):
        return self.sftp.files[self.path]

    def write(self, data):
        self.buffer.extend(data)


class MemorySftp:
    def __init__(self, files=None, fail_upload=False):
        self.files = dict(files or {})
        self.dirs = {"/"}
        self.fail_upload = fail_upload
        self.operations = []

    def open(self, path, mode):
        return MemoryFile(self, path, mode)

    def stat(self, path):
        if path not in self.dirs and path not in self.files:
            raise FileNotFoundError(path)

    def mkdir(self, path):
        self.dirs.add(path)
        self.operations.append(("mkdir", path))

    def remove(self, path):
        self.operations.append(("delete", path))
        if path not in self.files:
            raise FileNotFoundError(path)
        del self.files[path]

    def posix_rename(self, source, destination):
        self.operations.append(("rename", source, destination))
        self.files[destination] = self.files.pop(source)


class DeployCommonTests(unittest.TestCase):
    def test_settings_defaults_full_and_invalid_values(self):
        env = {"SFTP_HOST": "host", "SFTP_USER": "user", "SFTP_PASS": "secret", "TARGET_DIR": "/srv/minecraft"}
        with patch.dict(os.environ, env, clear=True):
            settings = deploy_common.read_settings()
            self.assertEqual((settings.host, settings.user, settings.password, settings.target),
                             ("host", "user", "secret", "/srv/minecraft"))
            self.assertEqual(settings.port, 22)
            self.assertFalse(settings.full)
            with patch.dict(os.environ, {"SFTP_PORT": "2222", "FORCE_FULL": "TRUE"}):
                settings = deploy_common.read_settings()
                self.assertEqual(settings.port, 2222)
                self.assertTrue(settings.full)
            for key, value in (("SFTP_HOST", ""), ("TARGET_DIR", "/"), ("TARGET_DIR", "relative"),
                               ("SFTP_PORT", "0"), ("SFTP_PORT", "65536"), ("SFTP_PORT", "bad")):
                with self.subTest(key=key, value=value), patch.dict(os.environ, {key: value}):
                    with self.assertRaises(ValueError):
                        deploy_common.read_settings()

    def test_remote_paths_and_smart_full_planning(self):
        current = {scope.name: {"mods/new.jar": entry(b"new"), "same.cfg": entry(b"same")}
                   for scope in deploy_common.SCOPES}
        previous = {scope.name: {"old.cfg": entry(b"old"), "same.cfg": entry(b"same")}
                    for scope in deploy_common.SCOPES}
        for full in (False, True):
            plans = deploy_common.plan_deployment(current, previous, full)
            for scope in deploy_common.SCOPES:
                self.assertEqual(plans[scope.name],
                                 (["mods/new.jar", "same.cfg"] if full else ["mods/new.jar"], ["old.cfg"]))
        server, client = deploy_common.SCOPES
        self.assertEqual(deploy_common.remote_root("/srv/minecraft/", server), "/srv/minecraft")
        self.assertEqual(deploy_common.remote_root("/srv/minecraft/", client),
                         "/srv/minecraft/automodpack/host-modpack/main")
        self.assertEqual(deploy_common.remote_path("/srv/minecraft/", server.manifest_name),
                         "/srv/minecraft/deploy_server_manifest.json")

    def test_both_entrypoints_scan_once_before_remote_operations(self):
        env = {"SFTP_HOST": "host", "SFTP_USER": "user", "SFTP_PASS": "secret", "TARGET_DIR": "/srv/minecraft"}
        with tempfile.TemporaryDirectory() as temp:
            make_builds(Path(temp))
            with chdir(temp), patch.dict(os.environ, env, clear=True):
                for module in (deploy_sftp, deploy_rsync):
                    with self.subTest(transport=module.__name__):
                        sftp = MemorySftp()
                        sftp.close = lambda: None
                        paramiko = MagicMock()
                        paramiko.SFTPClient.from_transport.return_value = sftp

                        def remote_call(*args, **kwargs):
                            self.assertEqual(scan.call_count, 1)
                            return SimpleNamespace(returncode=0, stdout="{}", stderr="")

                        paramiko.Transport.side_effect = lambda *args: (remote_call(), MagicMock())[1]
                        with patch.object(module, "scan_builds", wraps=deploy_common.scan_builds) as scan, \
                                patch.dict("sys.modules", {"paramiko": paramiko}), \
                                patch.object(deploy_rsync, "_run", side_effect=remote_call):
                            self.assertEqual(module.main(), 0)
                            self.assertEqual(scan.call_count, 1)

    def test_scans_both_trees_and_filters_bootstrap_and_server_runtime(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            make_builds(root)
            (root / "build/server/automodpack/server.conf").parent.mkdir()
            (root / "build/server/automodpack/server.conf").write_bytes(b"manual")
            states = deploy_common.scan_builds(root)
            self.assertIn("mods/common.jar", states["server"])
            self.assertNotIn("automodpack/server.conf", states["server"])
            self.assertIn("mods/client-only.jar", states["client"])
            self.assertNotIn("mods/automodpack-5.0.0-rc.4.jar", states["client"])
            self.assertNotIn("automodpack/client.conf", states["client"])

    def test_rejects_empty_build_and_malformed_or_unsafe_manifest(self):
        scope = deploy_common.SCOPES[0]
        with self.assertRaises(ValueError):
            deploy_common.validate_manifest({"../outside": entry(b"x")}, scope)
        with self.assertRaises(ValueError):
            deploy_common.validate_manifest({"ok": {"hash": "bad", "size": 1}}, scope)
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaises(ValueError):
                deploy_common.scan_builds(temp)


class SftpDeploymentTests(unittest.TestCase):
    def test_scopes_migrate_server_manifest_and_protect_manual_runtime(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            make_builds(root)
            target = "/srv/minecraft"
            old_server = {"automodpack/server.conf": entry(b"manual"), "old.txt": entry(b"old")}
            old_client = {
                "mods/automodpack-old.jar": entry(b"old jar"),
                "removed.cfg": entry(b"gone"),
            }
            sftp = MemorySftp({
                target + "/deploy_manifest.json": json.dumps(old_server).encode(),
                target + "/deploy_client_manifest.json": json.dumps(old_client).encode(),
                target + "/automodpack/server.conf": b"user-owned",
                target + "/automodpack/runtime/timeline.json": b"runtime",
                target + "/world/region.mca": b"unmanaged world",
                target + "/old.txt": b"old",
            })
            deploy_sftp.deploy(sftp, target, project_root=root)
            self.assertEqual(sftp.files[target + "/automodpack/server.conf"], b"user-owned")
            self.assertEqual(sftp.files[target + "/automodpack/runtime/timeline.json"], b"runtime")
            self.assertEqual(sftp.files[target + "/world/region.mca"], b"unmanaged world")
            self.assertNotIn(target + "/old.txt", sftp.files)
            self.assertNotIn(target + "/automodpack/host-modpack/main/removed.cfg", sftp.files)
            self.assertIn(target + "/automodpack/host-modpack/main/config/example.cfg", sftp.files)
            self.assertNotIn(target + "/automodpack/host-modpack/main/mods/automodpack-5.0.0-rc.4.jar", sftp.files)
            self.assertIn(target + "/deploy_server_manifest.json", sftp.files)
            self.assertNotIn(target + "/automodpack/server.conf", json.loads(sftp.files[target + "/deploy_server_manifest.json"]))
            last_delete = max(i for i, operation in enumerate(sftp.operations) if operation[0] == "delete")
            first_manifest_publish = min(
                i for i, operation in enumerate(sftp.operations)
                if operation[0] == "rename" and operation[2].endswith("deploy_server_manifest.json")
                or operation[0] == "rename" and operation[2].endswith("deploy_client_manifest.json")
            )
            self.assertLess(last_delete, first_manifest_publish)

    def test_failed_payload_write_does_not_publish_success_manifests(self):
        class FailingSftp(MemorySftp):
            def open(self, path, mode):
                if "w" in mode and "/deploy_" not in path:
                    raise OSError("upload failed")
                return super().open(path, mode)

        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            make_builds(root)
            sftp = FailingSftp()
            with self.assertRaises(OSError):
                deploy_sftp.deploy(sftp, "/srv/minecraft", project_root=root)
            self.assertNotIn("/srv/minecraft/deploy_server_manifest.json", sftp.files)
            self.assertNotIn("/srv/minecraft/deploy_client_manifest.json", sftp.files)

    def test_invalid_canonical_manifest_does_not_fall_back_to_legacy(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            make_builds(root)
            target = "/srv/minecraft"
            sftp = MemorySftp({
                target + "/deploy_server_manifest.json": b"{broken",
                target + "/deploy_manifest.json": json.dumps({"old.txt": entry(b"old")}).encode(),
            })
            with self.assertRaises(ValueError):
                deploy_sftp.deploy(sftp, target, project_root=root)
            self.assertEqual(sftp.operations, [])
            self.assertNotIn(target + "/deploy_client_manifest.json", sftp.files)


class RsyncDeploymentTests(unittest.TestCase):
    def test_file_lists_are_scoped_and_manifests_publish_after_deletions(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            make_builds(root)
            calls = []
            server_previous = {
                "config/example.cfg": entry(b"config"),
                "mods/common.jar": entry(b"common"),
                "old-server.txt": entry(b"old"),
                "automodpack/server.conf": entry(b"manual"),
            }
            client_previous = {
                "config/example.cfg": entry(b"previous config"),
                "mods/common.jar": entry(b"common"),
                "mods/client-only.jar": entry(b"client-only"),
                "mods/automodpack-old.jar": entry(b"bootstrap"),
                "removed-client.txt": entry(b"old"),
            }

            def fake_run(args, env, *, capture=False, check=True):
                calls.append((args, capture, check))
                if capture:
                    command = args[-1]
                    if "deploy_server_manifest.json" in command:
                        return type("Result", (), {"returncode": 0, "stdout": json.dumps(server_previous), "stderr": ""})()
                    if "deploy_client_manifest.json" in command:
                        return type("Result", (), {"returncode": 0, "stdout": json.dumps(client_previous), "stderr": ""})()
                if args[0:3] == ["sshpass", "-e", "rsync"] and "--files-from=" in " ".join(args):
                    list_path = next(arg.split("=", 1)[1] for arg in args if arg.startswith("--files-from="))
                    calls[-1] = (args, capture, check, Path(list_path).read_bytes())
                return type("Result", (), {"returncode": 0, "stdout": "", "stderr": ""})()

            with patch.object(deploy_rsync, "_run", side_effect=fake_run):
                deploy_rsync.deploy("host", "user", "22", "/srv/minecraft", "secret", project_root=root)

            upload_calls = [call for call in calls if len(call) == 4]
            self.assertEqual(len(upload_calls), 1)
            self.assertIn("config/example.cfg\0", upload_calls[0][3].decode())
            self.assertIn("automodpack/host-modpack/main", " ".join(upload_calls[0][0]))
            self.assertTrue(any("automodpack/host-modpack/main" in " ".join(call[0]) for call in calls if call[0][0] == "sshpass"))
            self.assertFalse(any("--delete" in " ".join(call[0]) for call in calls))
            delete_positions = [i for i, call in enumerate(calls) if call[0][-1].startswith("rm -f")]
            manifest_positions = [i for i, call in enumerate(calls) if "deploy_server_manifest.json.tmp-" in call[0][-1] or "deploy_client_manifest.json.tmp-" in call[0][-1]]
            self.assertEqual(len(delete_positions), 2)
            self.assertLess(max(delete_positions), min(manifest_positions))

            calls.clear()
            with patch.object(deploy_rsync, "_run", side_effect=fake_run):
                deploy_rsync.deploy("host", "user", "22", "/srv/minecraft", "secret", full=True, project_root=root)
            full_lists = [call[3].decode().split("\0") for call in calls if len(call) == 4]
            self.assertEqual(len(full_lists), 2)
            self.assertNotIn("mods/automodpack-5.0.0-rc.4.jar", full_lists[1])

    def test_delete_failure_prevents_manifest_publication(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            make_builds(root)
            commands = []
            previous = {"removed.txt": entry(b"old")}

            def fake_run(args, env, *, capture=False, check=True):
                commands.append(args)
                if capture:
                    command = args[-1]
                    if "deploy_server_manifest.json" in command:
                        return type("Result", (), {"returncode": 0, "stdout": json.dumps(previous), "stderr": ""})()
                    if "deploy_client_manifest.json" in command:
                        return type("Result", (), {"returncode": 0, "stdout": "{}", "stderr": ""})()
                if args[-1].startswith("rm -f"):
                    raise RuntimeError("delete failed")
                return type("Result", (), {"returncode": 0, "stdout": "", "stderr": ""})()

            with patch.object(deploy_rsync, "_run", side_effect=fake_run):
                with self.assertRaisesRegex(RuntimeError, "delete failed"):
                    deploy_rsync.deploy("host", "user", "22", "/srv/minecraft", "secret", project_root=root)
            self.assertFalse(any(command[-1].startswith("mv -f") for command in commands))


if __name__ == "__main__":
    unittest.main()
