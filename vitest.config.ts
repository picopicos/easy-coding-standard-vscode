import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src'],
      reporter: ['text', 'cobertura', ['html', { subdir: 'html' }]],
    },
    reporters: ['default', ['junit', { outputFile: 'junit-report.xml' }]],
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/**/*.test.ts'],
          exclude: ['test/**/*.e2e.test.ts'],
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['test/**/*.e2e.test.ts'],
          testTimeout: 30000,
        },
      },
    ],
  },
});
