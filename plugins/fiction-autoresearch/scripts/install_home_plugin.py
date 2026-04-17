#!/usr/bin/env python3
"""Install the fiction-autoresearch plugin and skill library into Codex home paths."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


PLUGIN_NAME = "fiction-autoresearch"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Install the fiction-autoresearch Codex plugin and skill library into home-local Codex paths."
    )
    parser.add_argument(
        "--home",
        default=str(Path.home()),
        help="Home directory to install into. Defaults to the current user's home.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite the generated plugin manifest and helper symlinks if they already exist.",
    )
    return parser.parse_args()


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def ensure_clean_dir(path: Path) -> None:
    if path.is_symlink() or path.is_file():
        path.unlink()
    ensure_dir(path)


def write_text(path: Path, content: str, *, force: bool) -> None:
    if path.exists() and not force:
        return
    ensure_dir(path.parent)
    path.write_text(content)


def symlink_path(source: Path, destination: Path, *, force: bool) -> None:
    if destination.exists() or destination.is_symlink():
        if not force:
            return
        if destination.is_dir() and not destination.is_symlink():
            raise RuntimeError(
                f"Refusing to overwrite directory {destination}. Remove it manually or rerun elsewhere."
            )
        destination.unlink()
    ensure_dir(destination.parent)
    destination.symlink_to(source)


def discover_skills(skills_root: Path) -> dict[str, Path]:
    discovered: dict[str, Path] = {}
    for skill_file in sorted(skills_root.glob("*/*/SKILL.md")):
        skill_dir = skill_file.parent
        skill_name = skill_dir.name
        if skill_name in discovered:
            raise RuntimeError(
                f"Duplicate skill name {skill_name!r} found in {discovered[skill_name]} and {skill_dir}."
            )
        discovered[skill_name] = skill_dir
    return discovered


def sync_flat_skill_links(
    *,
    skills: dict[str, Path],
    destination_root: Path,
    force: bool,
) -> tuple[list[str], list[str]]:
    ensure_clean_dir(destination_root)
    installed: list[str] = []
    skipped: list[str] = []

    for skill_name, source_dir in skills.items():
        destination = destination_root / skill_name
        if destination.exists() or destination.is_symlink():
            if destination.is_symlink() and destination.resolve() == source_dir.resolve():
                installed.append(skill_name)
                continue
            if not force:
                skipped.append(skill_name)
                continue
            if destination.is_dir() and not destination.is_symlink():
                raise RuntimeError(
                    f"Refusing to overwrite directory {destination}. Remove it manually or rerun elsewhere."
                )
            destination.unlink()

        ensure_dir(destination.parent)
        destination.symlink_to(source_dir)
        installed.append(skill_name)

    return installed, skipped


def load_marketplace(path: Path) -> dict:
    if not path.exists():
        return {
            "name": "home-local-plugins",
            "interface": {"displayName": "Home Local Plugins"},
            "plugins": [],
        }
    return json.loads(path.read_text())


def upsert_plugin_entry(marketplace: dict) -> dict:
    plugins = marketplace.setdefault("plugins", [])
    for entry in plugins:
        if entry.get("name") == PLUGIN_NAME:
            entry.update(
                {
                    "name": PLUGIN_NAME,
                    "source": {"source": "local", "path": f"./plugins/{PLUGIN_NAME}"},
                    "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
                    "category": "Productivity",
                }
            )
            return marketplace

    plugins.append(
        {
            "name": PLUGIN_NAME,
            "source": {"source": "local", "path": f"./plugins/{PLUGIN_NAME}"},
            "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
            "category": "Productivity",
        }
    )
    return marketplace


def main() -> None:
    args = parse_args()
    home = Path(args.home).expanduser().resolve()
    repo_root = Path(__file__).resolve().parents[3]
    plugin_source_root = repo_root / "plugins" / PLUGIN_NAME
    skills_source_root = repo_root / "skills"
    codex_source_root = repo_root / ".codex"
    discovered_skills = discover_skills(skills_source_root)

    install_root = home / "plugins" / PLUGIN_NAME
    manifest_path = install_root / ".codex-plugin" / "plugin.json"
    marketplace_path = home / ".agents" / "plugins" / "marketplace.json"
    user_skills_root = home / ".agents" / "skills"

    ensure_dir(install_root / ".codex-plugin")

    manifest = {
        "name": PLUGIN_NAME,
        "version": "0.1.0",
        "description": "Benchmark-first fiction improvement loops for webserial and web novel work.",
        "author": {"name": "Setavya", "email": "", "url": ""},
        "homepage": "",
        "repository": "",
        "license": "UNLICENSED",
        "keywords": ["fiction", "webserial", "benchmark", "autoresearch", "writing"],
        "skills": "./skills/",
        "interface": {
            "displayName": "Fiction Autoresearch",
            "shortDescription": "Run benchmarked fiction-improvement loops from a single draft.",
            "longDescription": "A Codex plugin for turning a piece of fiction into a benchmarked improvement loop with baseline evaluation, variant assumptions, rewrite routing, and reusable run logs.",
            "developerName": "Setavya",
            "category": "Productivity",
            "capabilities": ["Interactive", "Write"],
            "websiteURL": "",
            "privacyPolicyURL": "",
            "termsOfServiceURL": "",
            "defaultPrompt": [
                "Start a fiction autoresearch loop for this chapter.",
                "Design a custom benchmark for this webserial draft.",
                "Continue the latest loop and compare new variants.",
            ],
            "brandColor": "#7B5A2A",
        },
    }

    write_text(manifest_path, json.dumps(manifest, indent=2) + "\n", force=args.force)
    write_text(
        install_root / "README.md",
        (
            "# Fiction Autoresearch (Home Install)\n\n"
            "This home-local install reuses the shared skill library from the cloned repository.\n"
            "It also exports the same skills into ~/.agents/skills for direct user-skill discovery.\n"
            f"Source repo: {repo_root}\n"
        ),
        force=args.force,
    )

    plugin_skills_root = install_root / "skills"
    plugin_installed, plugin_skipped = sync_flat_skill_links(
        skills=discovered_skills,
        destination_root=plugin_skills_root,
        force=args.force,
    )
    user_installed, user_skipped = sync_flat_skill_links(
        skills=discovered_skills,
        destination_root=user_skills_root,
        force=args.force,
    )
    symlink_path(plugin_source_root / "scripts", install_root / "scripts", force=args.force)
    if codex_source_root.exists():
        symlink_path(codex_source_root, install_root / ".codex", force=args.force)

    marketplace = upsert_plugin_entry(load_marketplace(marketplace_path))
    ensure_dir(marketplace_path.parent)
    marketplace_path.write_text(json.dumps(marketplace, indent=2) + "\n")

    print("Installed fiction-autoresearch plugin.")
    print(f"Plugin root: {install_root}")
    print(f"Marketplace: {marketplace_path}")
    print(f"Plugin skills linked: {len(plugin_installed)}")
    print(f"User skills linked: {len(user_installed)}")
    if plugin_skipped or user_skipped:
        skipped_names = sorted(set(plugin_skipped + user_skipped))
        print(
            "Skipped existing skill destinations (rerun with --force to replace managed links): "
            + ", ".join(skipped_names)
        )
    print("Open Codex and use the local plugin entry from your home marketplace.")


if __name__ == "__main__":
    main()
