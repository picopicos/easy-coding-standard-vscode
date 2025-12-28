import * as assert from 'node:assert';
import * as path from 'node:path';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('picopico.easy-coding-standard'));
  });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension(
      'picopico.easy-coding-standard',
    );
    if (!extension) {
      assert.fail('Extension not found');
    }
    await extension.activate();
    assert.ok(extension.isActive);
  });

  test('Should format PHP file', async () => {
    // Fixture path
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      assert.fail('No workspace folder open');
    }
    const workspacePath = workspaceFolder.uri.fsPath;

    const filePath = path.join(
      workspacePath,
      'src',
      'test',
      'fixtures',
      'sample.php',
    );
    const configPath = path.join(
      workspacePath,
      'src',
      'test',
      'fixtures',
      'ecs.php',
    );

    // Open document
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);

    // Update configuration to point to local ECS and config
    const config = vscode.workspace.getConfiguration('easy-coding-standard');
    await config.update(
      'configPath',
      configPath,
      vscode.ConfigurationTarget.Workspace,
    );

    // Set executable path explicitly
    const executablePath = path.join(workspacePath, 'vendor', 'bin', 'ecs');
    await config.update(
      'executablePath',
      executablePath,
      vscode.ConfigurationTarget.Workspace,
    );

    // Execute formatting
    await vscode.commands.executeCommand('editor.action.formatDocument');

    // Get text
    const text = document.getText();

    // Verification: array() should become []
    assert.ok(
      text.includes('[]'),
      `Array syntax was not fixed to short syntax. Actual content:\n${text}`,
    );
    assert.ok(!text.includes('array('), 'Old array syntax still present');
  });
});
