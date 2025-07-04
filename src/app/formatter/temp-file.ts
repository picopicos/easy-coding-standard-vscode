import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { logger } from '../../logger';

/**
 * To format the current document including unsaved changes, we need to create a temporary copy of the document.
 */
export const createTempCopyOfDocument = async (
  content: string,
  originalFileName: string,
  signal: AbortSignal,
) => {
  const tempDir = os.tmpdir();
  const baseName = path.basename(
    originalFileName,
    path.extname(originalFileName),
  );
  const extension = path.extname(originalFileName);
  const timestamp = Date.now();
  const tempFileName = `${baseName}_${timestamp}${extension}`;
  const tempFilePath = path.join(tempDir, tempFileName);

  await fs.writeFile(tempFilePath, content, {
    encoding: 'utf8',
    signal,
  });
  logger.debug(`Created temp file: ${tempFilePath}`);

  return {
    documentPath: tempFilePath,
    deleteTempFile: async () => {
      await fs.unlink(tempFilePath);
      logger.debug(`Cleaned up temp file: ${tempFilePath}`);
    },
  };
};
