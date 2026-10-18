import contextlib
import importlib.util
import io
import os
from pathlib import Path
import tempfile
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('build_pack', PROJECT_ROOT / 'build_pack.py')
build_pack = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(build_pack)


class BuildPackTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for relative in ('mods/common.jar', 'mods/client-only.jar', 'config/shared.toml',
                         'defaultconfigs/shared.toml', 'kubejs/server_scripts/update.js',
                         'automodpack/client.conf', 'automodpack/server.conf',
                         'automodpack/timeline.json', 'deployment/template.conf',
                         'tests/fixture.py', 'server_pack/mods/server-only.jar',
                         'server_pack/config/server.toml',
                         'server_pack/automodpack/server.conf'):
            path = self.root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(relative, encoding='utf-8')
        (self.root / '.client_files').write_text('/mods/client-only.jar\n', encoding='utf-8')
        (self.root / '.packignore').write_text(
            '/automodpack\n/deployment\n/tests\n', encoding='utf-8')

    def tearDown(self):
        self.temp.cleanup()

    def test_client_and_server_outputs_keep_their_scope(self):
        previous_cwd = Path.cwd()
        try:
            os.chdir(self.root)
            with contextlib.redirect_stdout(io.StringIO()):
                build_pack.build_mode('client', str(self.root))
                build_pack.build_mode('server', str(self.root))
        finally:
            os.chdir(previous_cwd)

        client = self.root / 'build/client'
        server = self.root / 'build/server'
        self.assertEqual((client / 'automodpack/client.conf').read_text(), 'automodpack/client.conf')
        self.assertFalse((client / 'automodpack/server.conf').exists())
        self.assertFalse((client / 'automodpack/timeline.json').exists())
        self.assertFalse((server / 'automodpack').exists())
        self.assertTrue((client / 'mods/common.jar').is_file())
        self.assertTrue((server / 'mods/common.jar').is_file())
        self.assertFalse((server / 'mods/client-only.jar').exists())
        self.assertTrue((client / 'mods/client-only.jar').is_file())
        self.assertTrue((server / 'mods/server-only.jar').is_file())
        self.assertFalse((client / 'mods/server-only.jar').exists())
        for relative in ('config/shared.toml', 'defaultconfigs/shared.toml',
                         'kubejs/server_scripts/update.js'):
            self.assertTrue((client / relative).is_file())
            self.assertTrue((server / relative).is_file())
        self.assertFalse((client / 'deployment').exists())
        self.assertFalse((client / 'tests').exists())

    def test_missing_client_bootstrap_fails_before_cleaning_output(self):
        output = self.root / 'existing-output'
        output.mkdir()
        sentinel = output / 'keep.txt'
        sentinel.write_text('preserve', encoding='utf-8')
        (self.root / 'automodpack/client.conf').unlink()
        with self.assertRaises(FileNotFoundError):
            build_pack.build_mode('client', str(self.root), str(output))
        self.assertEqual(sentinel.read_text(encoding='utf-8'), 'preserve')


if __name__ == '__main__':
    unittest.main()
