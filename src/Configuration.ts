import path from 'node:path';
import { type Uri, workspace } from 'vscode';
import { findProjectRoot, resolveWithFallback } from './app/project-root';
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
  /**
   * Directory ECS is executed in. This is the nearest directory containing the
   * configured `configPath` (searched upward from the document), or the
   * workspace folder when no document is given or nothing is found.
   */
  projectRoot: string;
};

const DEFAULT_EXECUTABLE_PATH = 'vendor/bin/ecs';
const DEFAULT_CONFIG_PATH = 'ecs.php';

export const getCurrentConfig = async (
  workspaceUri: Uri,
  documentUri?: Uri,
): Promise<ECSConfig> => {
  const config = workspace.getConfiguration(
    'easy-coding-standard',
    documentUri ?? workspaceUri,
  );
  const memoryLimit = config.get<string>('memoryLimit') ?? '';
  const xdebug = config.get<boolean>('xdebug', false);
  const rawExecutablePath =
    config.get<string>('executablePath', DEFAULT_EXECUTABLE_PATH) ||
    DEFAULT_EXECUTABLE_PATH;
  const rawConfigPath =
    config.get<string>('configPath', DEFAULT_CONFIG_PATH) ||
    DEFAULT_CONFIG_PATH;

  const workspaceFolder = workspaceUri.fsPath;
  const projectRoot =
    documentUri && !path.isAbsolute(rawConfigPath)
      ? await findProjectRoot(
          documentUri.fsPath,
          workspaceFolder,
          rawConfigPath,
        )
      : workspaceFolder;

  const currentConfig = {
    enabled: config.get<boolean>('enabled', true),
    executablePath: await resolveWithFallback(
      rawExecutablePath,
      projectRoot,
      workspaceFolder,
    ),
    configPath: path.resolve(projectRoot, rawConfigPath),
    memoryLimit: memoryLimit === '' ? undefined : memoryLimit,
    xdebug: xdebug ? true : undefined,
    timeout: config.get<number>('timeout', 30000),
    extraArgs: config.get<string[]>('extraArgs', []),
    projectRoot,
  };

  logger.debug('Loaded current ECS config', currentConfig);

  return currentConfig;
};
