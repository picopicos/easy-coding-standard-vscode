// @see https://code.visualstudio.com/api/ux-guidelines/status-bar
import * as fs from 'node:fs/promises';
import * as vscode from 'vscode';
import { l10n } from 'vscode';
import { type ECSConfig, getCurrentConfig } from './Configuration';
import { logger } from './logger';

export enum ECSStatus {
  Ready = 'ready',
  Disabled = 'disabled',
  Error = 'error',
  Formatting = 'formatting',
}

export class Status implements vscode.Disposable {
  private statusBar: vscode.StatusBarItem;
  private currentStatus: ECSStatus = ECSStatus.Ready;

  constructor() {
    this.statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
    );
    this.updateDisplay();
    this.statusBar.show();
  }

  public static async init(): Promise<Status> {
    const status = new Status();

    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        status.disabled(l10n.t('status.disabled.noWorkspaceFolder'));
        return status;
      }

      const config = getCurrentConfig(workspaceFolders[0].uri);

      try {
        await fs.access(config.executablePath);
        status.setStatus(ECSStatus.Ready);
      } catch (_error) {
        status.error(
          l10n.t('status.error.executableNotFound', config.executablePath),
        );
      }
    } catch (error) {
      status.error(l10n.t('status.error.failedToCheckStatus'));
      logger.error('Failed to check initial ECS status', error);
    }

    return status;
  }

  async reloadReadyStatus(document: vscode.TextDocument, config: ECSConfig) {
    if (document.languageId !== 'php') {
      this.disabled(l10n.t('status.disabled.notPhpFile'));
      logger.info('Document is not a PHP file');
      return false;
    }

    if (!config.enabled) {
      this.disabled(l10n.t('status.disabled.ecsDisabled'));
      logger.info('ECS is not enabled for this document');
      return false;
    }

    try {
      await fs.access(config.executablePath);
    } catch (error) {
      this.error(
        l10n.t('status.error.executableNotFound', config.executablePath),
      );
      logger.error(`ECS executable not found: ${config.executablePath}`, error);
      vscode.window.showErrorMessage(
        l10n.t('status.error.executableNotFound', config.executablePath),
      );
      return false;
    }

    return true;
  }

  setStatus(status: ECSStatus, message?: string) {
    this.currentStatus = status;
    this.updateDisplay(message);
  }

  formatting() {
    this.setStatus(ECSStatus.Formatting);
  }

  completed() {
    this.setStatus(ECSStatus.Ready);
  }

  disabled(message?: string) {
    this.setStatus(ECSStatus.Disabled, message);
  }

  error(message?: string) {
    this.setStatus(ECSStatus.Error, message);
  }

  dispose() {
    this.statusBar.dispose();
  }

  private updateDisplay(customMessage?: string) {
    switch (this.currentStatus) {
      case ECSStatus.Ready:
        this.statusBar.text = '$(check) EasyCodingStandard';
        this.statusBar.tooltip = l10n.t('status.ready');
        this.statusBar.color = undefined;
        break;

      case ECSStatus.Disabled:
        this.statusBar.text = '$(circle-slash) EasyCodingStandard';
        this.statusBar.tooltip = customMessage || l10n.t('status.disabled');
        this.statusBar.color = undefined;
        break;

      case ECSStatus.Error:
        this.statusBar.text = '$(error) EasyCodingStandard';
        this.statusBar.tooltip = customMessage || l10n.t('status.error');
        this.statusBar.color = new vscode.ThemeColor(
          'statusBarItem.errorForeground',
        );
        break;

      case ECSStatus.Formatting:
        this.statusBar.text = '$(sync~spin) EasyCodingStandard';
        this.statusBar.tooltip = l10n.t('status.formatting');
        this.statusBar.color = undefined;
        break;
    }
  }
}
