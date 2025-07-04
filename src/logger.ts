import * as vscode from 'vscode';
import { conf } from './conf';

class Logger {
  private readonly outputChannel: vscode.OutputChannel;

  private readonly logLevel: vscode.LogLevel;

  constructor(logLevel?: vscode.LogLevel) {
    this.outputChannel = vscode.window.createOutputChannel(conf.name, {
      log: true,
    });
    this.logLevel = logLevel ?? vscode.LogLevel.Info;
  }

  show(preserveFocus?: boolean) {
    this.outputChannel.show(preserveFocus);
  }

  debug(message: string, data?: unknown) {
    this.log(message, vscode.LogLevel.Debug, data);
  }

  info(message: string, data?: unknown) {
    this.log(message, vscode.LogLevel.Info, data);
  }

  warn(message: string, data?: unknown) {
    this.log(message, vscode.LogLevel.Warning, data);
  }

  error(message: string, error?: unknown) {
    const data = error instanceof Error ? error : { error };

    this.log(message, vscode.LogLevel.Error, data);
  }

  trace(message: string, data?: unknown) {
    this.log(message, vscode.LogLevel.Trace, data);
  }

  private log(message: string, logLevel: vscode.LogLevel, data?: unknown) {
    const canLog =
      logLevel <= this.logLevel && logLevel !== vscode.LogLevel.Off;

    if (!canLog) {
      return;
    }

    this.outputChannel.appendLine(message);

    if (data) {
      try {
        const dataMessage =
          '\n' +
          (this.isJsonString(data) ? data : JSON.stringify(data, null, 2));
        this.outputChannel.appendLine(dataMessage);
      } catch (error) {
        this.outputChannel.appendLine(`Failed to stringify data: ${error}`);
      }
    }
  }

  private isJsonString(data: unknown): data is string {
    try {
      JSON.parse(data as string);
      return true;
    } catch {
      return false;
    }
  }
}

export const logger = new Logger(conf.logLevel);
