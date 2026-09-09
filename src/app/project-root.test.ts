import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { findProjectRoot, resolveWithFallback } from './project-root';

const touch = async (filePath: string) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, '');
};

describe('project-root', () => {
  let workspace: string;

  beforeEach(async () => {
    workspace = await fs.realpath(
      await fs.mkdtemp(path.join(os.tmpdir(), 'ecs-project-root-')),
    );
  });

  afterEach(async () => {
    await fs.rm(workspace, { recursive: true, force: true });
  });

  describe('findProjectRoot', () => {
    it('returns the nearest ancestor containing the marker', async () => {
      await touch(path.join(workspace, 'ecs.php'));
      await touch(path.join(workspace, 'packages/a/ecs.php'));
      const document = path.join(workspace, 'packages/a/src/Foo.php');

      await expect(
        findProjectRoot(document, workspace, 'ecs.php'),
      ).resolves.toBe(path.join(workspace, 'packages/a'));
    });

    it('returns the workspace folder when only it contains the marker', async () => {
      await touch(path.join(workspace, 'ecs.php'));
      const document = path.join(workspace, 'packages/a/src/Foo.php');

      await expect(
        findProjectRoot(document, workspace, 'ecs.php'),
      ).resolves.toBe(workspace);
    });

    it('falls back to the workspace folder when the marker is missing', async () => {
      const document = path.join(workspace, 'packages/a/src/Foo.php');

      await expect(
        findProjectRoot(document, workspace, 'ecs.php'),
      ).resolves.toBe(workspace);
    });

    it('does not walk above the workspace folder', async () => {
      await touch(path.join(workspace, 'ecs.php'));
      const inner = path.join(workspace, 'inner');
      const document = path.join(inner, 'src/Foo.php');

      await expect(findProjectRoot(document, inner, 'ecs.php')).resolves.toBe(
        inner,
      );
    });

    it('falls back to the workspace folder for documents outside it', async () => {
      const outside = path.join(os.tmpdir(), 'somewhere-else/Foo.php');

      await expect(
        findProjectRoot(outside, workspace, 'ecs.php'),
      ).resolves.toBe(workspace);
    });

    it('supports nested marker paths', async () => {
      await touch(path.join(workspace, 'packages/a/config/ecs.php'));
      const document = path.join(workspace, 'packages/a/src/Foo.php');

      await expect(
        findProjectRoot(document, workspace, 'config/ecs.php'),
      ).resolves.toBe(path.join(workspace, 'packages/a'));
    });
  });

  describe('resolveWithFallback', () => {
    it('returns absolute paths unchanged', async () => {
      await expect(
        resolveWithFallback('/usr/bin/ecs', workspace, workspace),
      ).resolves.toBe('/usr/bin/ecs');
    });

    it('resolves against the project root when the file exists there', async () => {
      const projectRoot = path.join(workspace, 'packages/a');
      await touch(path.join(projectRoot, 'vendor/bin/ecs'));
      await touch(path.join(workspace, 'vendor/bin/ecs'));

      await expect(
        resolveWithFallback('vendor/bin/ecs', projectRoot, workspace),
      ).resolves.toBe(path.join(projectRoot, 'vendor/bin/ecs'));
    });

    it('falls back to the workspace folder when missing in the project root', async () => {
      const projectRoot = path.join(workspace, 'packages/a');
      await touch(path.join(workspace, 'vendor/bin/ecs'));

      await expect(
        resolveWithFallback('vendor/bin/ecs', projectRoot, workspace),
      ).resolves.toBe(path.join(workspace, 'vendor/bin/ecs'));
    });

    it('resolves against the workspace folder without checking existence when it is the project root', async () => {
      await expect(
        resolveWithFallback('vendor/bin/ecs', workspace, workspace),
      ).resolves.toBe(path.join(workspace, 'vendor/bin/ecs'));
    });
  });
});
