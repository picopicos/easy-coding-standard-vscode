import * as assert from 'node:assert';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as vscode from 'vscode';

suite('Extension Test Suite', function () {
  this.timeout(20000);

  teardown(async function () {
    try {
      const history = await vscode.commands.executeCommand<string[]>(
        'easy-coding-standard.getLogHistory',
      );
      if (history && history.length > 0) {
        console.log('::group::--- Extension Logs ---');
        for (const log of history) {
          console.log(log);
        }
        console.log('::endgroup::');
      } else {
        console.log('--- Extension Logs: No logs found ---');
      }
    } catch (error) {
      console.error('Failed to retrieve extension logs:', error);
    }
  });

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

    const filePath = path.join(workspacePath, 'e2e', 'fixtures', 'sample.php');
    const configPath = path.join(workspacePath, 'e2e', 'fixtures', 'ecs.php');
    const executablePath = path.join(workspacePath, 'vendor', 'bin', 'ecs');

    // Check paths
    if (!fs.existsSync(executablePath)) {
      assert.fail(`ECS executable not found at: ${executablePath}`);
    }
    if (!fs.existsSync(configPath)) {
      assert.fail(`ECS config not found at: ${configPath}`);
    }

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
    await config.update(
      'executablePath',
      executablePath,
      vscode.ConfigurationTarget.Workspace,
    );

    // Execute formatting
    await vscode.commands.executeCommand('editor.action.formatDocument');

    // Wait for formatting to apply
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get text
    const text = document.getText();

    // Verification: array() should become []
    assert.ok(text.includes('['), `Array syntax was not fixed to short syntax. Actual content:\n${text}`);
    assert.ok(!text.includes('array('), 'Old array syntax still present');
  });

  test('Should detect the nearest ecs.php for nested projects', async () => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      assert.fail('No workspace folder open');
    }
    const workspacePath = workspaceFolder.uri.fsPath;

    // `e2e/fixtures/nested/ecs.php` exists but the workspace root has no ecs.php,
    // so formatting only succeeds if the extension walks up from the document
    // and picks the nested config. The executable is resolved from the
    // workspace root because the nested project has no vendor directory.
    const filePath = path.join(
      workspacePath,
      'e2e',
      'fixtures',
      'nested',
      'src',
      'sample.php',
    );
    const nestedConfigPath = path.join(
      workspacePath,
      'e2e',
      'fixtures',
      'nested',
      'ecs.php',
    );
    if (!fs.existsSync(nestedConfigPath)) {
      assert.fail(`Nested ECS config not found at: ${nestedConfigPath}`);
    }
    if (fs.existsSync(path.join(workspacePath, 'ecs.php'))) {
      assert.fail('Workspace root must not contain ecs.php for this test');
    }

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);

    const config = vscode.workspace.getConfiguration('easy-coding-standard');
    await config.update(
      'configPath',
      'ecs.php',
      vscode.ConfigurationTarget.Workspace,
    );
    await config.update(
      'executablePath',
      'vendor/bin/ecs',
      vscode.ConfigurationTarget.Workspace,
    );

    await vscode.commands.executeCommand('editor.action.formatDocument');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const text = document.getText();
    assert.ok(
      text.includes('['),
      `Array syntax was not fixed to short syntax. Actual content:\n${text}`,
    );
    assert.ok(!text.includes('array('), 'Old array syntax still present');
  });
});
