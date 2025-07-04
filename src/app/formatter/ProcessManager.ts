import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { execa } from 'execa';
import type * as vscode from 'vscode';
import { logger } from '../../logger';

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class ProcessManager {
  private tempFilePath: string | null = null;

  /**
   * @returns Created temp file path
   */
  async createTempFile(
    content: string,
    originalFileName: string,
  ): Promise<string> {
    const tempDir = os.tmpdir();
    const baseName = path.basename(
      originalFileName,
      path.extname(originalFileName),
    );
    const extension = path.extname(originalFileName);
    const timestamp = Date.now();
    const tempFileName = `${baseName}_${timestamp}${extension}`;
    this.tempFilePath = path.join(tempDir, tempFileName);

    try {
      await fs.writeFile(this.tempFilePath, content, 'utf8');
      logger.debug(`Created temp file: ${this.tempFilePath}`);
      return this.tempFilePath;
    } catch (error) {
      logger.error('Failed to create temp file:', error);
      throw new Error(
        `Failed to create temp file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async run(
    args: string[],
    cancellationToken: vscode.CancellationToken,
    timeout: number,
    executablePath: string,
    cwd: string,
  ): Promise<ProcessResult> {
    logger.info(`Running ECS command: ${executablePath} ${args.join(' ')}`);

    try {
      const abortController = new AbortController();
      cancellationToken.onCancellationRequested(() => {
        logger.info('ECS formatting was cancelled');
        abortController.abort();
      });

      const result = await execa(executablePath, args, {
        cwd,
        timeout,
        signal: abortController.signal,
        reject: false,
      });

      return {
        stdout: typeof result.stdout === 'string' ? result.stdout : '',
        stderr: typeof result.stderr === 'string' ? result.stderr : '',
        exitCode: result.exitCode || 0,
      };
    } catch (error) {
      if (cancellationToken.isCancellationRequested) {
        throw new Error('ECS formatting was cancelled');
      }

      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error('ECS command timed out');
      }

      throw new Error(
        `Failed to execute ECS: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  cleanup(): void {
    if (this.tempFilePath) {
      fs.unlink(this.tempFilePath)
        .then(() => {
          logger.debug(`Cleaned up temp file: ${this.tempFilePath}`);
        })
        .catch((error) => {
          logger.warn(
            `Failed to cleanup temp file: ${this.tempFilePath}`,
            error,
          );
        });
      this.tempFilePath = null;
    }
  }
}
