import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'json-summary'],
      reportOnFailure: true,
    },
  },
});
