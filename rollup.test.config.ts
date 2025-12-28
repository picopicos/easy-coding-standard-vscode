import alias from '@rollup/plugin-alias';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from './rollup.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clone the base config to avoid mutating the original if it were used elsewhere
const testConfig = [...baseConfig];
const extensionConfig = testConfig[0];

if (!extensionConfig) {
  throw new Error('No extension configuration found in rollup.config.ts');
}

// Inject alias plugin at the beginning to ensure it takes precedence
extensionConfig.plugins = [
  alias({
    entries: [
      {
        find: /.*\/logger$/, // Match imports ending with /logger (e.g. ./logger)
        replacement: path.resolve(__dirname, 'e2e/mocks/logger.ts'),
      },
    ],
  }),
  ...(extensionConfig.plugins || []),
];

export default testConfig;
