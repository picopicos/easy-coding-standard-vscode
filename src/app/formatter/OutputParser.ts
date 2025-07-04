import parseDiff from 'parse-diff';
import * as vscode from 'vscode';
import { logger } from '../../logger';

export type ECSJsonOutput = {
  totals: {
    errors: number;
    diffs: number;
  };
  files: {
    [filepath: string]: {
      diffs: Array<{
        diff: string;
        applied_checkers: string[];
      }>;
    };
  };
};

export class OutputParser {
  parse(jsonOutput: string): vscode.TextEdit[] {
    const diffs = this.resolveFileDiffs(JSON.parse(jsonOutput));
    const textEdits: vscode.TextEdit[] = diffs.flatMap((diffData) =>
      this.convertDiffToTextEdits(diffData.diff),
    );

    logger.debug('Generated TextEdits from ECS output', {
      diffs,
      textEdits,
    });
    return textEdits;
  }

  private resolveFileDiffs(
    jsonOutput: ECSJsonOutput,
  ): ECSJsonOutput['files'][string]['diffs'] {
    if (jsonOutput.totals.errors > 0) {
      throw new Error(
        `ECS found errors in the output: ${jsonOutput.totals.errors}`,
      );
    }

    if (jsonOutput.totals.diffs === 0) {
      logger.debug('No diffs found - file is already properly formatted');
      return [];
    }

    return Object.values(jsonOutput.files).flatMap((file) => file.diffs);
  }

  private convertDiffToTextEdits(diff: string): vscode.TextEdit[] {
    return parseDiff(diff)
      .flatMap((file) => file.chunks)
      .map((chunk) => {
        let newContent = chunk.changes
          .filter((change) => change.type !== 'del')
          .map((change) => change.content.slice(1))
          .join('\n');

        if (!newContent.endsWith('\n')) {
          newContent += '\n';
        }

        const range = new vscode.Range(
          new vscode.Position(chunk.oldStart - 1, 0), // 0-based index
          new vscode.Position(chunk.oldStart - 1 + chunk.oldLines, 0),
        );

        return vscode.TextEdit.replace(range, newContent);
      });
  }
}
