import type * as vscode from 'vscode';
import type { ECSConfig } from '../../Configuration';
import { logger } from '../../logger';

import type { CommandBuilder } from './CommandBuilder';
import type { OutputParser } from './OutputParser';
import type { ProcessManager } from './ProcessManager';

export class Formatter {
  constructor(
    private readonly processManager: ProcessManager,
    private readonly commandBuilder: CommandBuilder,
    private readonly outputParser: OutputParser,
  ) {}

  async run(
    document: vscode.TextDocument,
    cancellationToken: vscode.CancellationToken,
    workspaceFolder: vscode.WorkspaceFolder,
    config: ECSConfig,
  ): Promise<vscode.TextEdit[]> {
    try {
      const tempFilePath = await this.processManager.createTempFile(
        document.getText(),
        document.fileName,
      );

      if (cancellationToken.isCancellationRequested) {
        logger.debug('ECS formatting was cancelled before execution');
        return [];
      }

      const args = this.commandBuilder.create(config, tempFilePath);

      const result = await this.processManager.run(
        args,
        cancellationToken,
        config.timeout,
        config.executablePath,
        workspaceFolder.uri.fsPath,
      );

      if (cancellationToken.isCancellationRequested || !result.stdout.trim()) {
        logger.debug('ECS formatting was cancelled or returned empty output');
        return [];
      }

      const textEdits = this.outputParser.parse(result.stdout);

      return textEdits;
    } catch (error) {
      if (error instanceof Error && error.message.includes('cancelled')) {
        logger.debug('ECS formatting was cancelled');
        return [];
      }

      throw error;
    } finally {
      this.processManager.cleanup();
    }
  }
}
