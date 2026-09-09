# Change Log

All notable changes to the "easy-coding-standard" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Make all settings resource-scoped so they can be configured per workspace folder in multi-root workspaces
- Check the initial status against the workspace folder of the active editor instead of always the first folder
- Detect the nearest `ecs.php` by walking up from the document to the workspace folder, so nested projects in a monorepo can use their own config
- Resolve a relative `executablePath` from the detected project root, falling back to the workspace folder

## [1.0.5]

- Update development dependencies to latest compatible versions
- Update Biome schema to 2.4.2
- Improve dependency update workflow with consolidated PR handling

## [1.0.4]

- Update all dependencies to latest versions
- Add E2E tests and CI workflow
- Add contribution guidelines and developer documentation

## [1.0.3]

- fix failure to create cache file
- update error message

## [1.0.2]

- fix logger bug

## [1.0.0]

- add Japanese support
- update dependencies

## [0.0.4]

- update README.md

## [0.0.3]

- update README.md

## [0.0.2]

- Add support for status bar.

## [0.0.1]

- Initial release
