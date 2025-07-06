import * as vscode from 'vscode';
import { l10n } from 'vscode';
import type { Application } from './app/Application';
import { getCurrentConfig } from './Configuration';
import { logger } from './logger';
import type { Status } from './Status';

export class ECSDocumentFormattingEditProvider
  implements vscode.DocumentFormattingEditProvider
{
  constructor(
    private readonly application: Application,
    private readonly status: Status,
  ) {}

  async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    /** This options does not affect the formatting process because all formatting options are set in the ecs.php file */
    _options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
  ): Promise<vscode.TextEdit[]> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
      this.status.disabled(l10n.t('status.disabled.noWorkspaceFolder'));
      logger.warn('File is not part of a workspace');
      return [];
    }

    // Use the same config during the formatting process as the one used to detect the document.
    const config = getCurrentConfig(workspaceFolder.uri);
    return this.application.generateTextEdits(
      document,
      config,
      token,
      this.status,
    );
  }
}
