#!/usr/bin/env python3
import os
import shutil
import argparse
import subprocess

from pathspec import GitIgnoreSpec

# Configuration
CLIENT_FILES_IGNORE = '.client_files'
PACK_IGNORE = '.packignore'
SERVER_PACK_DIR = 'server_pack'
DEFAULT_BUILD_DIR = 'build'
AUTOMODPACK_CLIENT_CONFIG = os.path.join('automodpack', 'client.conf')

def load_ignore_rules(root_dir, *file_names):
    patterns = []
    for file_name in file_names:
        file_path = os.path.join(root_dir, file_name)
        if os.path.isfile(file_path):
            with open(file_path, encoding='utf-8') as file:
                patterns.extend(file)
    return GitIgnoreSpec.from_lines(patterns)


def is_ignored(path, pack_rules, git_rules):
    match = pack_rules.check_file(path).include
    if match is not None:
        return match
    for prefix, rules in reversed(git_rules):
        match = rules.check_file(path[len(prefix):]).include
        if match is not None:
            return match
    return False


def copy_tree(src, dst, pack_rules, git_rules, prefix=''):
    if prefix and os.path.isfile(os.path.join(src, '.gitignore')):
        git_rules = (*git_rules, (prefix, load_ignore_rules(src, '.gitignore')))

    os.makedirs(dst, exist_ok=True)
    for item in os.listdir(src):
        if item in {'.git', '.github', '.idea', 'build', '__pycache__',
                    CLIENT_FILES_IGNORE, PACK_IGNORE, os.path.basename(__file__)}:
            continue
        if not prefix and item == SERVER_PACK_DIR:
            continue

        src_path = os.path.join(src, item)
        dst_path = os.path.join(dst, item)
        is_dir = os.path.isdir(src_path)
        path = prefix + item + ('/' if is_dir else '')
        if is_ignored(path, pack_rules, git_rules):
            continue

        if is_dir:
            copy_tree(src_path, dst_path, pack_rules, git_rules, path)
        else:
            shutil.copy2(src_path, dst_path)


def ensure_git_lfs(root_dir):
    """Ensures git LFS files are present when building from a git repo."""
    git_dir = os.path.join(root_dir, '.git')
    if not os.path.exists(git_dir):
        return

    if shutil.which('git') is None:
        print("Warning: git is not available; continuing with existing files.")
        return

    print("Ensuring git LFS files are present...")
    try:
        result = subprocess.run(['git', 'lfs', 'pull'], cwd=root_dir)
    except OSError as e:
        print(f"Warning: could not run git lfs pull ({e}); continuing with existing files.")
        return

    if result.returncode != 0:
        print(f"Warning: git lfs pull failed with exit code {result.returncode}; continuing with existing files.")

def build_mode(mode, root_dir, output_dir=None):
    client_config = os.path.join(root_dir, AUTOMODPACK_CLIENT_CONFIG)
    if mode == 'client' and not os.path.isfile(client_config):
        raise FileNotFoundError(f"Required AutoModpack client config is missing: {client_config}")

    if output_dir:
        target_dir = output_dir
    else:
        target_dir = os.path.join(root_dir, DEFAULT_BUILD_DIR, mode)

    rule_files = (PACK_IGNORE, CLIENT_FILES_IGNORE) if mode == 'server' else (PACK_IGNORE,)
    pack_rules = load_ignore_rules(root_dir, *rule_files)
    git_rules = (('', load_ignore_rules(root_dir, '.gitignore')),)

    # Prepare Output Directory
    if os.path.exists(target_dir):
        print(f"Cleaning output directory: {target_dir}")
        shutil.rmtree(target_dir)
    os.makedirs(target_dir)

    print(f"Building {mode} pack to {target_dir}...")
    copy_tree(root_dir, target_dir, pack_rules, git_rules)

    if mode == 'server':
        server_pack_path = os.path.join(root_dir, SERVER_PACK_DIR)
        prefix = SERVER_PACK_DIR + '/'
        print(f"Overlaying {SERVER_PACK_DIR}...")
        if not os.path.isdir(server_pack_path):
            print(f"Warning: Source directory for merge '{server_pack_path}' does not exist. Skipping.")
        elif not is_ignored(prefix, pack_rules, git_rules):
            copy_tree(server_pack_path, target_dir, pack_rules, git_rules, prefix)

        # Keep the client bootstrap and all machine-owned runtime state out of servers.
        automodpack_dir = os.path.join(target_dir, 'automodpack')
        if os.path.exists(automodpack_dir):
            shutil.rmtree(automodpack_dir)
    else:
        # Keep the required bootstrap even if the AutoModpack directory was excluded.
        client_config_target = os.path.join(target_dir, AUTOMODPACK_CLIENT_CONFIG)
        if not os.path.isfile(client_config_target):
            os.makedirs(os.path.dirname(client_config_target), exist_ok=True)
            shutil.copy2(client_config, client_config_target)


def main():
    parser = argparse.ArgumentParser(description='Minecraft Modpack Builder')
    parser.add_argument('mode', nargs='?', choices=['client', 'server'], help='Build mode: client, server, or both (default)')
    parser.add_argument('--output', '-o', default=None, help='Output directory (only used when building specific mode)')
    
    args = parser.parse_args()
    
    root_dir = os.getcwd()

    ensure_git_lfs(root_dir)
    
    if args.mode:
        build_mode(args.mode, root_dir, args.output)
    else:
        if args.output:
            print("Warning: --output argument is ignored when building both modes.")
        
        build_mode('client', root_dir)
        print("-" * 20)
        build_mode('server', root_dir)
        
    print("Done!")

if __name__ == '__main__':
    main()
