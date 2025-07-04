import path from 'node:path';
import { type Uri, workspace } from 'vscode';
import { conf } from './conf';
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
  clearCache?: boolean;
  memoryLimit?: string;
  xdebug?: boolean;
  debug?: boolean;
  timeout: number;
};

export const getCurrentConfig = (workspaceUri: Uri): ECSConfig => {
  const config = workspace.getConfiguration(conf.id, workspaceUri);

  return {
    enabled: config.get('enabled', true),
    executablePath: resolvePath(
      config.get('executablePath', 'vendor/bin/ecs'),
      workspaceUri.fsPath,
    ),
    configPath: resolvePath(
      config.get('configPath', 'ecs.php'),
      workspaceUri.fsPath,
    ),
    clearCache: config.get('clearCache', undefined),
    memoryLimit: config.get('memoryLimit'),
    xdebug: config.get('xdebug', undefined),
    debug: config.get('debug', undefined),
    timeout: config.get('timeout', 30000),
  };
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
