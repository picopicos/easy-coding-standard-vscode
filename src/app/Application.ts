import * as vscode from 'vscode';
import { l10n } from 'vscode';
import type { ECSConfig } from '../Configuration';
import { logger } from '../logger';
import type { Status } from '../Status';
import { generateFormattedTextEdits } from './formatter/formatter';
import { ProcessError } from './formatter/process';

export class Application {
  async generateTextEdits(
    document: vscode.TextDocument,
    config: ECSConfig,
    cancellationToken: vscode.CancellationToken,
    status: Status,
  ): Promise<vscode.TextEdit[]> {
    const isReady = await status.reloadReadyStatus(document, config);
    if (!isReady) {
      return [];
    }

    const { abortSignal, onCancellationRequested } =
      await this.prepareAbortSignal(cancellationToken);

    try {
      status.formatting();
      const textEdits = await generateFormattedTextEdits(
        document,
        config,
        abortSignal,
      );
      status.completed();
      logger.info('Formatting process completed successfully');

      return textEdits;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      status.error(errorMessage);
      if (error instanceof ProcessError) {
        logger.error('Failed to format document', error.result);
      } else {
        logger.error(`Failed to format document: ${errorMessage}`, error);
      }

      vscode.window
        .showErrorMessage(
          l10n.t('error.failedToFormat', errorMessage),
          l10n.t('error.openLog'),
        )
        .then((action) => {
          if (action === l10n.t('error.openLog')) {
            logger.outputChannel.show();
          }
        });
      return [];
    } finally {
      onCancellationRequested.dispose();
    }
  }

  private async prepareAbortSignal(
    cancellationToken: vscode.CancellationToken,
  ): Promise<{
    abortSignal: AbortSignal;
    onCancellationRequested: vscode.Disposable;
  }> {
    const abortController = new AbortController();

    const onCancellationRequested = cancellationToken.onCancellationRequested(
      () => {
        logger.info('ECS formatting was cancelled');
        abortController.abort();
      },
    );

    return {
      abortSignal: abortController.signal,
      onCancellationRequested,
    };
  }
}
