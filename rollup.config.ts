import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

export default defineConfig([
  {
    input: 'src/extension.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node'],
      }),
      esbuild({
        target: 'node18',
        sourceMap: true,
      }),
    ],
    external: ['vscode'],
  },
]);
