import * as vscode from 'vscode';
import { getCurrentConfig } from '../Configuration';
import { logger } from '../logger';
import type { Formatter } from './formatter';

export class Application {
  constructor(private readonly formatter: Formatter) {}

  async generateTextEdits(
    document: vscode.TextDocument,
    cancellationToken: vscode.CancellationToken,
  ): Promise<vscode.TextEdit[]> {
    if (document.languageId !== 'php') {
      return [];
    }

    if (document.isUntitled) {
      logger.warn('Cannot format untitled document');
      return [];
    }

    try {
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
      if (!workspaceFolder) {
        throw new Error('File is not part of a workspace');
      }

      const config = getCurrentConfig(workspaceFolder.uri);
      if (!config) {
        throw new Error('No config found for workspace folder');
      }

      const textEdits = await this.formatter.run(
        document,
        cancellationToken,
        workspaceFolder,
        config,
      );

      logger.info(
        `Generated ${textEdits.length} TextEdits for document formatting`,
      );
      return textEdits;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error('Failed to format document', error);

      vscode.window.showErrorMessage(`ECS formatting failed: ${errorMessage}`);
      return [];
    }
  }
}
