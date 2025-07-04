import parseDiff from 'parse-diff';
import * as vscode from 'vscode';
import { logger } from '../../logger';
import type { ECSDiff, ECSOutput } from './formatter';

/**
 * Pure function that generates text edits from ECS output.
 */
export const generateTextEdits = (ecsOutput: ECSOutput): vscode.TextEdit[] => {
  checkErrors(ecsOutput);
  checkUnexpectedFiles(ecsOutput);

  const diffs = resolveDiffs(ecsOutput);
  if (diffs.length === 0) {
    logger.debug('ECS did not find any diffs in the output');
    return [];
  }

  const textEdits: vscode.TextEdit[] = diffs.flatMap(convertDiffToTextEdits);
  logger.debug('Generated TextEdits from ECS output', {
    diffs,
    textEdits,
  });

  return textEdits;
};

const checkErrors = (ecsOutput: ECSOutput): void => {
  if (ecsOutput.totals.errors > 0) {
    throw new Error(
      `ECS found errors in the output: ${ecsOutput.totals.errors}`,
    );
  }
};

const checkUnexpectedFiles = (ecsOutput: ECSOutput): void => {
  if (Object.keys(ecsOutput.files).length > 1) {
    throw new Error(
      `ECS found unexpected multiple files in the output: ${Object.keys(
        ecsOutput.files,
      ).join(', ')}`,
    );
  }
};

const resolveDiffs = (ecsOutput: ECSOutput): ECSDiff[] =>
  Object.values(ecsOutput.files)[0]?.diffs ?? [];

const convertDiffToTextEdits = (diffData: ECSDiff): vscode.TextEdit[] => {
  return parseDiff(diffData.diff)
    .flatMap((file) => file.chunks)
    .map((chunk) => {
      const newText = extractNewText(chunk);
      const oldRange = calcOldRange(chunk);

      return vscode.TextEdit.replace(oldRange, newText);
    });
};

const extractNewText = (chunk: parseDiff.Chunk): string =>
  `${chunk.changes
    .filter((change) => change.type !== 'del') // add or normal only
    .map((change) => change.content.slice(1)) // remove + or space
    .join('\n')}\n`;

const calcOldRange = (chunk: parseDiff.Chunk): vscode.Range =>
  new vscode.Range(
    new vscode.Position(chunk.oldStart - 1, 0), // 0-based index
    new vscode.Position(chunk.oldStart - 1 + chunk.oldLines, 0),
  );
