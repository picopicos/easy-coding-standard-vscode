<h1 align="center">Easy&nbsp;Coding&nbsp;Standard&nbsp;for&nbsp;VS&nbsp;Code</h1>

<p align="center">
  <img alt="Marketplace version" src="https://img.shields.io/visual-studio-marketplace/v/picopico.easy-coding-standard?color=blue&logo=visualstudiocode">
  <img alt="Open VSX version" src="https://img.shields.io/open-vsx/v/picopico/easy-coding-standard?color=fuchsia&logo=openvsx">
  <img alt="CI" src="https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/ci.yml/badge.svg">
  <img alt="License" src="https://img.shields.io/github/license/picopicos/easy-coding-standard-vscode">
</p>

## Feature

| 💎  | What It Does | Why You’ll Love It |
|-----|--------------|--------------------|
| ⚙️  **Formatting API** | Hooks directly into VS Code’s native formatter | Zero-friction; just press `⌘S` / `Ctrl+S` |
| 🟢 **Status Bar** | Shows a live ECS status icon | Instant feedback (and bragging rights) |

## Getting Started

1. **Open Command Palette**(`Ctrl+Shift+P`) → `Preferences: Open Workspace Settings (JSON)`  
2. Add the configuration

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

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## License

[MIT](LICENSE)

