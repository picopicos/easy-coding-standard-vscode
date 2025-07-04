// Entry point for the extension.
import * as vscode from 'vscode';
import { Application } from './app/Application';
import { ECSDocumentFormattingEditProvider } from './ECSDocumentFormattingEditProvider';
import { logger } from './logger';
import { Status } from './Status';
import { l10n } from 'vscode';

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  try {
    logger.info('Starting Easy Coding Standard extension activation');

    const application = new Application();
    const status = await Status.init();

    vscode.languages.registerDocumentFormattingEditProvider(
      {
        language: 'php',
        scheme: 'file',
      },
      new ECSDocumentFormattingEditProvider(application, status),
    );
    context.subscriptions.push(status);

    logger.info('Easy Coding Standard extension activated successfully');
  } catch (error) {
    logger.error('Failed to activate Easy Coding Standard extension:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(
      l10n.t('error.failedToActivate', errorMessage),
    );

    throw error;
  }
}

export function deactivate(context: vscode.ExtensionContext): void {
  context.subscriptions.forEach((subscription) => {
    if (subscription instanceof Status) {
      subscription.dispose();
    }
  });

  logger.info('Easy Coding Standard extension deactivated');
}
