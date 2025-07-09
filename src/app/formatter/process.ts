import { type ExecaReturnValue, execa } from 'execa';
import type * as vscode from 'vscode';
import type { ECSConfig } from '../../Configuration';
import { logger } from '../../logger';
import { createCommand } from './command';
import { createTempCopyOfDocument } from './temp-file';

export interface ECSProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class PhpSyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PhpSyntaxError';
  }
}

export class AbortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AbortError';
  }
}

export class ProcessError extends Error {
  constructor(
    message: string,
    public readonly result: ExecaReturnValue<string>,
  ) {
    super(message);
    this.name = 'ECSProcessError';
    this.result = result;
  }
}

/**
 * @throws {PhpSyntaxError} if the PHP syntax is invalid
 * @throws {AbortError} if the formatting is cancelled
 * @throws {ProcessError} if the ECS process failed
 */
export const runEcsProcess = async (
  document: vscode.TextDocument,
  config: ECSConfig,
  abortSignal: AbortSignal,
): Promise<ECSProcessResult> => {
  const { documentPath, deleteTempFile } = await createTempCopyOfDocument(
    document.getText(),
    document.fileName,
    abortSignal,
  );

  try {
    if (
      !(await isPhpSyntaxValid(
        documentPath,
        abortSignal,
        config.workspaceFolder,
      ))
    ) {
      throw new PhpSyntaxError('PHP syntax is invalid');
    }

    const args = createCommand({
      filePath: documentPath,
      configPath: config.configPath,
      memoryLimit: config.memoryLimit,
      xdebug: config.xdebug,
      extraArgs: config.extraArgs,
    });

    logger.debug(
      'Executing ECS command',
      [config.executablePath, ...args].join(' '),
    );
    const result = await execa(config.executablePath, args, {
      timeout: config.timeout,
      signal: abortSignal,
      reject: false,
      cwd: config.workspaceFolder,
    });
    logger.debug('ECS process result', result);

    if (result.isCanceled) {
      throw new AbortError('ECS formatting was cancelled');
    }

    // 0: no changes, 1: command failed, 2: changed code or found errors
    // @see https://github.com/easy-coding-standard/easy-coding-standard/blob/main/src/Console/ExitCode.php
    if (result.exitCode !== 0 && result.exitCode !== 2) {
      throw new ProcessError('ECS process failed', result);
    }

    return result;
  } finally {
    await deleteTempFile();
  }
};

export const isPhpSyntaxValid = async (
  filePath: string,
  abortSignal: AbortSignal,
  cwd: string,
): Promise<boolean> => {
  const result = await execa('php', ['-l', filePath], {
    reject: false,
    signal: abortSignal,
    cwd,
  });
  logger.debug('PHP syntax check result', result);
  return result.exitCode === 0;
};
