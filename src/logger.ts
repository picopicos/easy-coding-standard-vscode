import * as vscode from 'vscode';

class Logger {
  private readonly logOutputChannel: vscode.LogOutputChannel;

  constructor() {
    this.logOutputChannel = vscode.window.createOutputChannel(
      'Easy Coding Standard',
      {
        log: true,
      },
    );
  }

  show(preserveFocus?: boolean) {
    this.logOutputChannel.show(preserveFocus);
  }

  debug(message: string, data?: unknown) {
    this.logOutputChannel.debug(this.formatData(message, data));
  }

  info(message: string, data?: unknown) {
    this.logOutputChannel.info(this.formatData(message, data));
  }

  warn(message: string, data?: unknown) {
    this.logOutputChannel.warn(this.formatData(message, data));
  }

  error(message: string, error?: unknown) {
    const data = error instanceof Error ? error : { error };

    this.logOutputChannel.error(this.formatData(message, data));
  }

  trace(message: string, data?: unknown) {
    this.logOutputChannel.trace(this.formatData(message, data));
  }

  private formatData(message: string, data: unknown): string {
    if (data === undefined) {
      return message;
    }

    return `${message}\n${JSON.stringify(data, null, 2)}`;
  }
}

export const logger = new Logger();
