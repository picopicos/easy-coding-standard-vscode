<h1 align="center">Easy&nbsp;Coding&nbsp;Standard&nbsp;for&nbsp;VS&nbsp;Code</h1>

<p align="center">
  <img alt="GitHub release" src="https://img.shields.io/github/release-date/picopicos/easy-coding-standard-vscode">
  <img alt="Marketplace downloads" src="https://img.shields.io/visual-studio-marketplace/d/picopico.easy-coding-standard">
  <img alt="Marketplace version" src="https://img.shields.io/visual-studio-marketplace/v/picopico.easy-coding-standard?color=blue">
  <img alt="Rating" src="https://img.shields.io/visual-studio-marketplace/r/picopico.easy-coding-standard">
  <img alt="CI" src="https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/test.yml/badge.svg">
  <img alt="License" src="https://img.shields.io/github/license/picopicos/easy-coding-standard-vscode?color=lightgray">
  <br>
</p>

<p align="center">
  <a href="README.md">English</a> | <strong>日本語</strong>
</p>

## 機能

Formatting APIに対応しています。保存時に自動的にフォーマッターが実行されます。

## はじめに

1. コマンドパレットを開く（`Ctrl+Shift+P`/`Shift+⌘+P`）
1. `Preferences: Open Workspace Settings (JSON)`を選択
1. 以下の設定を追加

```jsonc
{
  "[php]": {
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "editor.defaultFormatter": "picopico.easy-coding-standard"
    // "picopico.easy-coding-standard.executablePath": "path/to/vendor/bin/ecs", // デフォルトパスを変更する場合
    // "picopico.easy-coding-standard.configPath": "path/to/ecs.php" // デフォルトパスを変更する場合
  }
}
```

保存時にドキュメントを自動的にフォーマットできます。手動でドキュメントをフォーマットする場合は、`Shift+Ctrl+F`/`Shift+⌘+F`を押してください。

## 設定

| 設定 | デフォルト | 説明 |
|---------|---------|-------------|
| `easy-coding-standard.enabled` | `true` | Easy Coding Standard拡張機能を有効/無効にする |
| `easy-coding-standard.executablePath` | `vendor/bin/ecs` | ECS実行ファイルへのパス |
| `easy-coding-standard.configPath` | `ecs.php` | ECS設定ファイル（ecs.php）へのパス。空の場合、ワークスペース内でecs.phpを検索します。 |
| `easy-coding-standard.memoryLimit` | `""` | ECSプロセスのメモリ制限 |
| `easy-coding-standard.xdebug` | `false` | ECSでXdebugを有効にする |
| `easy-coding-standard.timeout` | `30000` | ECSコマンド実行のタイムアウト（ミリ秒） |
| `easy-coding-standard.extraArgs` | `[]` | ECSの追加引数 |

## Contributing

IssueやPull Requestなどお気軽にどうぞ！

## License

[MIT](LICENSE)
