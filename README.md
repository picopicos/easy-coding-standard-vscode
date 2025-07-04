# Easy Coding Standard for VSCode

Easy Coding Standard extension for VSCode with multi-language support.

## Features

- Support for Formatting API
- Real-time status indication in status bar
- Multi-language support (English, Japanese)
- PHP syntax validation before formatting
- Comprehensive error handling

## Language Support

This extension supports the following languages:
- **English** (default)
- **日本語** (Japanese)

The extension automatically detects your VSCode language setting and displays messages accordingly.

## Configuration

Available settings:

- `easy-coding-standard.enabled`: Enable/disable the extension
- `easy-coding-standard.executablePath`: Path to the ECS executable (default: `vendor/bin/ecs`)
- `easy-coding-standard.configPath`: Path to the ECS configuration file (default: `ecs.php`)
- `easy-coding-standard.memoryLimit`: Memory limit for the ECS process
- `easy-coding-standard.xdebug`: Allow running xdebug
- `easy-coding-standard.timeout`: Timeout for ECS command execution in milliseconds
- `easy-coding-standard.extraArgs`: Extra arguments for ECS

## Status Bar

The extension shows its current status in the VSCode status bar:

- ✅ **Ready**: ECS is configured and ready to use
- ⛔ **Disabled**: ECS is disabled or not available for the current file
- ❌ **Error**: There's an issue with the ECS configuration
- 🔄 **Formatting**: ECS is currently formatting the document

## Usage

1. Open a PHP file in your workspace
2. Use the Format Document command (`Shift+Alt+F` on Windows/Linux, `Shift+Option+F` on Mac)
3. The extension will automatically format your code using ECS

## Requirements

- PHP installed and available in PATH
- Easy Coding Standard installed in your project (`vendor/bin/ecs`)
- ECS configuration file (`ecs.php`) in your project root

## Installation

1. Install the extension from the VSCode Marketplace
2. Ensure PHP and ECS are properly configured in your project
3. The extension will automatically activate when you open a PHP file

## Troubleshooting

If you encounter issues:

1. Check that PHP is installed and accessible
2. Verify that ECS is installed in your project
3. Ensure your `ecs.php` configuration file exists
4. Check the extension settings for correct paths
5. View the Output panel (Easy Coding Standard) for detailed logs

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT
