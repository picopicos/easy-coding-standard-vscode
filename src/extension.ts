// Entry point for the extension.
import * as vscode from 'vscode';
import { Application } from './app/Application';
import { CommandBuilder } from './app/formatter/CommandBuilder';
import { Formatter } from './app/formatter/Formatter';
import { OutputParser } from './app/formatter/OutputParser';
import { ProcessManager } from './app/formatter/ProcessManager';
import { ECSDocumentFormattingEditProvider } from './ECSDocumentFormattingEditProvider';
import { logger } from './logger';

export async function activate(
  _context: vscode.ExtensionContext,
): Promise<void> {
  try {
    logger.info('Starting Easy Coding Standard extension activation');

    const application = new Application(
      new Formatter(
        new ProcessManager(),
        new CommandBuilder(),
        new OutputParser(),
      ),
    );

    // register formatter
    vscode.languages.registerDocumentFormattingEditProvider(
      {
        language: 'php',
        scheme: 'file',
      },
      new ECSDocumentFormattingEditProvider(application),
    );

    logger.info('Easy Coding Standard extension activated successfully');
  } catch (error) {
    logger.error('Failed to activate Easy Coding Standard extension:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(
      `Easy Coding Standard extension failed to activate: ${errorMessage}`,
    );

    throw error;
  }
}

export function deactivate(): void {
  logger.info('Easy Coding Standard extension deactivated');
}
