# AI Agent Guide for Easy Coding Standard VS Code Extension

This document provides a comprehensive overview of the `easy-coding-standard-vscode` project for AI agents and developers.

## 1. Project Overview

**Project Name:** Easy Coding Standard (VS Code Extension)
**Purpose:** Integrates the PHP [Easy Coding Standard (ECS)](https://github.com/easy-coding-standard/easy-coding-standard) tool into Visual Studio Code, providing code formatting and linting capabilities for PHP files.
**Key Features:**
- Formats PHP code using ECS.
- Supports custom configuration paths (`ecs.php`).
- Configurable executable path (`vendor/bin/ecs`).
- Integrates with VS Code's native formatting API.

## 2. Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js (VS Code Extension Host)
- **Framework:** VS Code Extension API
- **Build Tools:**
  - `rollup`: Bundler
  - `esbuild`: Transpiler (via `rollup-plugin-esbuild`)
  - `vsce`: Packaging tool
- **Testing:**
  - `vitest`: Unit testing framework
  - `@vscode/test-electron`: Integration testing
- **Linting & Formatting:** `biome` (replaces ESLint/Prettier)
- **Dependencies:**
  - `execa`: For executing the ECS binary.
  - `parse-diff`: For parsing ECS output diffs.
  - `@vscode/l10n`: For localization.

## 3. Architecture

The extension follows a standard VS Code extension architecture with a focus on modularity.

### Entry Point
- **`src/extension.ts`**: The main entry point. It exports `activate` and `deactivate` functions. It initializes the `Application` and registers the `ECSDocumentFormattingEditProvider`.

### Core Components
- **`src/app/Application.ts`**: The central coordinator application logic.
- **`src/ECSDocumentFormattingEditProvider.ts`**: Implements `vscode.DocumentFormattingEditProvider`. It acts as the bridge between VS Code's formatting request and the internal ECS logic.
- **`src/Configuration.ts`**: Manages extension settings (enabled status, paths, timeouts).
- **`src/Status.ts`**: Manages the VS Code status bar item to show extension status.
- **`src/logger.ts`**: Handles logging to the VS Code Output Channel.

### Formatter Logic (`src/app/formatter/`)
- **`formatter.ts`**: Orchestrates the formatting process.
- **`command.ts`**: Constructs and executes the shell command to run ECS.
- **`process.ts`**: Handles the child process execution.
- **`text-edit-generator.ts`**: Parses the diff output from ECS and converts it into `vscode.TextEdit` objects to apply changes to the document.

## 4. Directory Structure

```
/
├── .github/             # GitHub Actions workflows (CI/CD)
├── .vscode/             # VS Code workspace settings and tasks
├── src/                 # Source code
│   ├── app/             # Core application logic
│   │   ├── formatter/   # ECS execution and diff parsing
│   │   └── index.ts
│   ├── Configuration.ts # Configuration management
│   ├── extension.ts     # Entry point
│   ├── logger.ts        # Logging utility
│   └── Status.ts        # Status bar management
├── l10n/                # Localization files
├── test/                # Tests (if applicable, currently integrated in src or separate)
├── biome.json           # Biome configuration (Linting/Formatting)
├── package.json         # Dependencies and scripts
├── rollup.config.ts     # Rollup build configuration
├── tsconfig.json        # TypeScript configuration
└── vitest.config.ts     # Vitest configuration
```

## 5. Development Workflow

### Setup
1.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Development Scripts
-   **Build (Watch Mode):**
    ```bash
    npm run dev
    ```
-   **Compile (Production):**
    ```bash
    npm run compile
    ```

### Testing
-   **Run Unit Tests:**
    ```bash
    npm test
    # or
    npm run test:coverage
    ```

### Code Quality
-   **Lint and Format:**
    ```bash
    npm run format
    ```
    (Note: This uses `biome check --fix --unsafe`)

### Packaging
-   **Create VSIX Package:**
    ```bash
    npm run package
    ```

## 6. Guidelines for AI Agents

-   **Code Style:** Strictly follow the existing coding style enforced by `biome`. Run `npm run format` before committing.
-   **Testing:** Write unit tests for new logic using `vitest`. Ensure tests are located alongside the source code or in a dedicated test directory as per project pattern.
-   **VS Code API:** Prefer using the latest stable VS Code API patterns.
-   **Error Handling:** Use `logger.error` for internal errors and `vscode.window.showErrorMessage` for user-facing errors. Use `l10n` for all user-facing strings.

## 7. GitHub Workflow

We follow the **GitHub Flow**.

### Branching Strategy
-   **Main Branch:** `main` (Protected, deployable)
-   **Feature Branches:** Create branches from `main` with descriptive names (e.g., `feature/add-config-option`, `fix/formatter-error`).

### Pull Requests (PR)

-   Create a Pull Request to merge your feature branch into `main`.
-   **Assignee:** Assign yourself to the PR.
-   **Labels:** Add appropriate labels (e.g., `enhancement`, `bug`, `documentation`, `dependencies`).

#### PR Template

Use the following format for PR descriptions:

```markdown
## Purpose
<!-- WHY is this change needed? What problem does it solve? -->

## Details
<!-- WHAT was changed? Briefly describe the implementation details. -->

## Verification
<!-- HOW was it tested? -->
- [ ] `npm run format` passed
- [ ] `npm test` passed
- [ ] Manual verification in VS Code Debugger

## Related Issues
<!-- Link to related issues using #issue_number. -->
```
