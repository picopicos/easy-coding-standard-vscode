import * as vscode from 'vscode';

class Logger {
  private static instance: Logger;

  private readonly logOutputChannel: vscode.LogOutputChannel;
  private readonly history: string[] = [];
  private readonly maxHistoryItems = 1000;

  private constructor() {
    this.logOutputChannel = vscode.window.createOutputChannel(
      'Easy Coding Standard',
      {
        log: true,
      },
    );

    // Register command to retrieve logs for testing
    // In a test environment, it's acceptable that this disposable isn't cleaned up by the extension context
    vscode.commands.registerCommand('easy-coding-standard.getLogHistory', () => {
      return this.history;
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  get outputChannel(): vscode.OutputChannel {
    return this.logOutputChannel;
  }

  show(preserveFocus?: boolean) {
    this.logOutputChannel.show(preserveFocus);
  }

  debug(message: string, data?: unknown) {
    const formatted = this.formatData(message, data);
    this.logOutputChannel.debug(formatted);
    this.addToHistory('debug', formatted);
  }

  info(message: string, data?: unknown) {
    const formatted = this.formatData(message, data);
    this.logOutputChannel.info(formatted);
    this.addToHistory('info', formatted);
  }

  warn(message: string, data?: unknown) {
    const formatted = this.formatData(message, data);
    this.logOutputChannel.warn(formatted);
    this.addToHistory('warn', formatted);
  }

  error(message: string, error?: unknown) {
    const data = error instanceof Error ? error : { error };
    const formatted = this.formatData(message, data);
    this.logOutputChannel.error(formatted);
    this.addToHistory('error', formatted);
  }

  trace(message: string, data?: unknown) {
    const formatted = this.formatData(message, data);
    this.logOutputChannel.trace(formatted);
    this.addToHistory('trace', formatted);
  }

  private addToHistory(level: string, message: string) {
    this.history.push(`[${new Date().toISOString()}] [${level}] ${message}`);
    if (this.history.length > this.maxHistoryItems) {
      this.history.shift();
    }
  }

  private formatData(message: string, data: unknown): string {
    if (data === undefined) {
      return message;
    }

    return `${message}\n${JSON.stringify(data, null, 2)}`;
  }
}

export const logger = Logger.getInstance();
