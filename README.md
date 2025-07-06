# Easy Coding Standard for VSCode

Easy Coding Standard extension for VSCode.

## Features

- Support for Formatting API
- Real-time status indication in status bar
- Multi-language support (English, Japanese)

## Configuration

Available settings:

- `easy-coding-standard.enabled`: Enable/disable the extension (default: `true`)
- `easy-coding-standard.executablePath`: Path to the ECS executable (default: `vendor/bin/ecs`)
- `easy-coding-standard.configPath`: Path to the ECS configuration file (default: `ecs.php`)
- `easy-coding-standard.memoryLimit`: Memory limit for the ECS process
- `easy-coding-standard.xdebug`: Allow running xdebug
- `easy-coding-standard.timeout`: Timeout for ECS command execution in milliseconds (default: `30000`)
- `easy-coding-standard.extraArgs`: Extra arguments for ECS

## Recommended configuration

1. Open command palette and choose `Preferences: Open Workspace Settings (JSON)`
2. Add following settings.

```json
{
    "[php]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "picopico.easy-coding-standard"
        // "picopico.easy-coding-standard.executablePath": "path/to/executable", // If you need to change default path
        // "picopico.easy-coding-standard.configPath": "path/to/ecs.php" // If you need to change default path
    },
}
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT
