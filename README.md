<h1 align="center">Easy&nbsp;Coding&nbsp;Standard&nbsp;for&nbsp;VS&nbsp;Code</h1>

<div align="center">

[![GitHub release](https://img.shields.io/github/release-date/picopicos/easy-coding-standard-vscode?label=Latest&nbsp;Release)](https://github.com/picopicos/easy-coding-standard-vscode/releases)
[![VS Marketplace downloads](https://img.shields.io/visual-studio-marketplace/d/picopico.easy-coding-standard)](https://marketplace.visualstudio.com/items?itemName=picopico.easy-coding-standard)
[![VS Marketplace version](https://img.shields.io/visual-studio-marketplace/v/picopico.easy-coding-standard?color=blue)](https://marketplace.visualstudio.com/items?itemName=picopico.easy-coding-standard)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/picopico.easy-coding-standard)](https://marketplace.visualstudio.com/items?itemName=picopico.easy-coding-standard&ssr=false#review-details)
[![CI (test)](https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/test.yml)
[![CI (release)](https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/release.yml/badge.svg)](https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/release.yml)
[![License](https://img.shields.io/github/license/picopicos/easy-coding-standard-vscode)](https://github.com/picopicos/easy-coding-standard-vscode/blob/main/LICENSE)

</div>

<p align="center">
  <strong>English</strong> | <a href="https://github.com/picopicos/easy-coding-standard-vscode/blob/main/README.ja.md">日本語</a>
</p>

## Features

Native support for Formatting API. Automatically runs formatter on save.

## Getting Started

1. Open Command Palette (`Ctrl+Shift+P`/`Shift+⌘+P`)
1. Choose `Preferences: Open Workspace Settings (JSON)`  
1. Add the following configuration

```jsonc
{
  "[php]": {
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "editor.defaultFormatter": "picopico.easy-coding-standard"
    // "picopico.easy-coding-standard.executablePath": "path/to/vendor/bin/ecs", // If you need to change the default path
    // "picopico.easy-coding-standard.configPath": "path/to/ecs.php" // If you need to change the default path
  }
}
```

You can automatically format document on save. If you need to format document manually, press `Shift+Ctrl+F`/`Shift+⌘+F`.

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `easy-coding-standard.enabled` | `true` | Enable/disable Easy Coding Standard extension |
| `easy-coding-standard.executablePath` | `vendor/bin/ecs` | Path to the ECS executable |
| `easy-coding-standard.configPath` | `ecs.php` | Path to the ECS configuration file (ecs.php). If empty, will search for ecs.php in the workspace. |
| `easy-coding-standard.memoryLimit` | `""` | Memory limit for the ECS process |
| `easy-coding-standard.xdebug` | `false` | Enable Xdebug for ECS |
| `easy-coding-standard.timeout` | `30000` | Timeout for ECS command execution in milliseconds |
| `easy-coding-standard.extraArgs` | `[]` | Extra arguments for ECS |

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

[MIT](LICENSE)

