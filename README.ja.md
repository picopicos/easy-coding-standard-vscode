<h1 align="center">Easy&nbsp;Coding&nbsp;Standard&nbsp;for&nbsp;VS&nbsp;Code</h1>

<div align="center">

[![Visual Studio Marketplace Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/picopico.easy-coding-standard?cacheSeconds=86400)](https://marketplace.visualstudio.com/items?itemName=picopico.easy-coding-standard)
[![VS Marketplace version](https://img.shields.io/visual-studio-marketplace/v/picopico.easy-coding-standard?color=blue&cacheSeconds=86400)](https://marketplace.visualstudio.com/items?itemName=picopico.easy-coding-standard)
[![VS Marketplace downloads](https://img.shields.io/visual-studio-marketplace/d/picopico.easy-coding-standard?cacheSeconds=86400)](https://marketplace.visualstudio.com/items?itemName=picopico.easy-coding-standard)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/picopico.easy-coding-standard?cacheSeconds=86400)](https://marketplace.visualstudio.com/items?itemName=picopico.easy-coding-standard&ssr=false&cacheSeconds=86400#review-details)
[![CI (test)](https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/picopicos/easy-coding-standard-vscode/actions/workflows/test.yml)
[![License](https://img.shields.io/github/license/picopicos/easy-coding-standard-vscode)](https://github.com/picopicos/easy-coding-standard-vscode/blob/main/LICENSE)

</div>

<p align="center">
  <a href="https://github.com/picopicos/easy-coding-standard-vscode">English</a> | <strong>日本語</strong>
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
    "editor.defaultFormatter": "picopico.easy-coding-standard"
  }
}
```

保存時にドキュメントを自動的にフォーマットできます。手動でドキュメントをフォーマットする場合は、`Shift+Ctrl+F`/`Shift+⌘+F`を押してください。

### マルチルートワークスペース

すべての設定はリソーススコープなので、ワークスペースフォルダごとに設定できます。[マルチルートワークスペース](https://code.visualstudio.com/docs/editor/multi-root-workspaces)では、各フォルダの`.vscode/settings.json`または`.code-workspace`ファイルの`settings`ブロックで、フォルダごとに異なるECS実行ファイルと`ecs.php`を指定できます。相対パスは、フォーマット対象ファイルを含むワークスペースフォルダを基準に解決されます。

### モノレポ・ネストしたプロジェクト

`configPath`が相対パス（既定の`ecs.php`）の場合、フォーマット対象ファイルのディレクトリからワークスペースフォルダまで上方向に探索し、最初に見つかったディレクトリをプロジェクトルートとして扱います。ECSはそのディレクトリを作業ディレクトリとして実行されるため、モノレポ内の各パッケージが独自の`ecs.php`を持てます。相対パスの`executablePath`は同じプロジェクトルートを基準に解決され、見つからない場合はワークスペースフォルダにフォールバックするので、ルートの`vendor/bin/ecs`をネストしたパッケージ間で共有できます。

## 設定

| 設定 | デフォルト | 説明 |
|---------|---------|-------------|
| `easy-coding-standard.enabled` | `true` | Easy Coding Standard拡張機能を有効/無効にする |
| `easy-coding-standard.executablePath` | `vendor/bin/ecs` | ECS実行ファイルへのパス。相対パスは検出されたプロジェクトルートを基準に解決され、見つからない場合はワークスペースフォルダを基準にします。 |
| `easy-coding-standard.configPath` | `ecs.php` | ECS設定ファイル（ecs.php）へのパス。相対パスはドキュメントのディレクトリからワークスペースフォルダまで上方向に検索されるため、ネストしたプロジェクトごとに個別の設定を持てます。 |
| `easy-coding-standard.memoryLimit` | `""` | ECSプロセスのメモリ制限 |
| `easy-coding-standard.xdebug` | `false` | ECSでXdebugを有効にする |
| `easy-coding-standard.timeout` | `30000` | ECSコマンド実行のタイムアウト（ミリ秒） |
| `easy-coding-standard.extraArgs` | `[]` | ECSの追加引数 |

## Contributing

IssueやPull Requestなどお気軽にどうぞ！

## License

[MIT](LICENSE)
