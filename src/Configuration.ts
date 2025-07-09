import path from 'node:path';
import { type Uri, workspace } from 'vscode';
import { logger } from './logger';

/**
 * Easy Coding Standard specific configuration.
 *
 * @see `package.json#contributes.configuration`
 */
export type ECSConfig = {
  enabled: boolean;
  executablePath: string;
  configPath: string;
  memoryLimit?: string;
  xdebug?: boolean;
  timeout: number;
  extraArgs: string[];
  workspaceFolder: string;
};

export const getCurrentConfig = (workspaceUri: Uri): ECSConfig => {
  const config = workspace.getConfiguration(
    'easy-coding-standard',
    workspaceUri,
  );
  const memoryLimit = config.get<string>('memoryLimit') ?? '';
  const xdebug = config.get<boolean>('xdebug', false);

  const currentConfig = {
    enabled: config.get<boolean>('enabled', true),
    executablePath: resolvePath(
      config.get<string>('executablePath', 'vendor/bin/ecs'),
      workspaceUri.fsPath,
    ),
    configPath: resolvePath(
      config.get<string>('configPath', 'ecs.php'),
      workspaceUri.fsPath,
    ),
    memoryLimit: memoryLimit === '' ? undefined : memoryLimit,
    xdebug: xdebug ? true : undefined,
    timeout: config.get<number>('timeout', 30000),
    extraArgs: config.get<string[]>('extraArgs', []),
    workspaceFolder: workspaceUri.fsPath,
  };

  logger.debug('Loaded current ECS config', currentConfig);

  return currentConfig;
};

const resolvePath = (targetPath: string, workspacePath: string): string => {
  if (path.isAbsolute(targetPath)) {
    return targetPath;
  }

  const resolvedPath = path.resolve(workspacePath, targetPath);
  logger.debug(
    `Resolved path: ${resolvedPath} (workspace: ${workspacePath}, path: ${targetPath})`,
  );

  return resolvedPath;
};
