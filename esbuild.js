const esbuild = require("esbuild");

const isProduction = process.argv.includes("--production");
const isWatch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      });
      console.log("[watch] build finished");
    });
  },
};

const baseOptions = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outdir: "dist",
  external: ["vscode"],
  format: "cjs",
  platform: "node",
  target: "node18",
  sourcemap: !isProduction,
  minify: isProduction,
  tsconfig: "./tsconfig.json",
  logLevel: "info",
  define: {
    "process.env.NODE_ENV": isProduction ? '"production"' : '"development"',
  },
  plugins: [
    /* add to the end of plugins array */
    esbuildProblemMatcherPlugin,
  ],
};

async function build() {
  try {
    if (isWatch) {
      const context = await esbuild.context(baseOptions);
      await context.watch();
      console.log("👀 Watching for changes...");
    } else {
      await esbuild.build(baseOptions);
      console.log("✅ Build completed successfully");
    }
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
