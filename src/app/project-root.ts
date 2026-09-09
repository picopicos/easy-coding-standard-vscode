import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const exists = async (target: string): Promise<boolean> => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

/**
 * Yields `start` and each of its ancestors up to and including `stop`.
 * If `start` is not inside `stop`, only `stop` is yielded.
 */
const ancestorsUpTo = (start: string, stop: string): string[] => {
  const relative = path.relative(stop, start);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return [stop];
  }

  const dirs: string[] = [];
  let current = start;
  while (true) {
    dirs.push(current);
    if (current === stop) {
      break;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return dirs;
};

/**
 * Finds the nearest directory, walking up from `documentPath` to
 * `workspaceFolderPath`, that contains `relativeMarkerPath`.
 * Falls back to `workspaceFolderPath` when nothing is found.
 */
export const findProjectRoot = async (
  documentPath: string,
  workspaceFolderPath: string,
  relativeMarkerPath: string,
): Promise<string> => {
  for (const dir of ancestorsUpTo(
    path.dirname(documentPath),
    workspaceFolderPath,
  )) {
    if (await exists(path.join(dir, relativeMarkerPath))) {
      return dir;
    }
  }

  return workspaceFolderPath;
};

/**
 * Resolves `targetPath` against `projectRoot`. When the result does not exist,
 * falls back to resolving against `workspaceFolderPath` so that a monorepo can
 * share a single root-level ECS installation across nested projects.
 * Absolute paths are returned unchanged.
 */
export const resolveWithFallback = async (
  targetPath: string,
  projectRoot: string,
  workspaceFolderPath: string,
): Promise<string> => {
  if (path.isAbsolute(targetPath)) {
    return targetPath;
  }

  const fromProjectRoot = path.resolve(projectRoot, targetPath);
  if (projectRoot === workspaceFolderPath || (await exists(fromProjectRoot))) {
    return fromProjectRoot;
  }

  return path.resolve(workspaceFolderPath, targetPath);
};
