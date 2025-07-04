import type * as vscode from 'vscode';
import type { Application } from './app/Application';

export class ECSDocumentFormattingEditProvider
  implements vscode.DocumentFormattingEditProvider
{
  constructor(private readonly application: Application) {}

  async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    _options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
  ): Promise<vscode.TextEdit[]> {
    return this.application.generateTextEdits(document, token);
  }
}
