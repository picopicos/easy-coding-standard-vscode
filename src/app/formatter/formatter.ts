import type * as vscode from 'vscode';
import type { ECSConfig } from '../../Configuration';
import { logger } from '../../logger';
import { AbortError, PhpSyntaxError, runEcsProcess } from './process';
import { generateTextEdits } from './text-edit-generator';

export type ECSDiff = {
  diff: string;
  applied_checkers: string[];
};

/**
 * ECS output schema with json mode.
 *
 * @see https://github.com/easy-coding-standard/easy-coding-standard?tab=readme-ov-file#controlling-output-format
 */
export type ECSOutput = {
  totals: {
    errors: number;
    diffs: number;
  };
  files: Record<
    string,
    {
      diffs: ECSDiff[];
    }
  >;
};

/**
 * @throws {ProcessError} if the ECS process failed
 */
export const generateFormattedTextEdits = async (
  document: vscode.TextDocument,
  config: ECSConfig,
  abortSignal: AbortSignal,
): Promise<vscode.TextEdit[]> => {
  try {
    const ecsProcessResult = await runEcsProcess(document, config, abortSignal);

    const ecsOutput = JSON.parse(ecsProcessResult.stdout) as ECSOutput;
    logger.debug('ECS output', ecsOutput);

    return generateTextEdits(ecsOutput);
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException)?.name === 'AbortError' ||
      error instanceof AbortError
    ) {
      logger.info('Formatting was cancelled');
      return [];
    }

    if (error instanceof PhpSyntaxError) {
      logger.info('PHP syntax is invalid, skipping formatting');
      return [];
    }

    throw error;
  }
};
