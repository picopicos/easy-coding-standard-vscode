export type CommandOptions = {
  filePath: string;
  configPath: string;
  memoryLimit?: string;
  xdebug?: boolean;
  extraArgs: string[];
};

export const createCommand = (options: CommandOptions): string[] => {
  const args = ['check'];

  args.push(options.filePath);

  args.push('--config', options.configPath);

  args.push('--output-format=json');

  args.push('--no-interaction');
  args.push('--no-progress-bar');
  args.push('--no-ansi');

  if (options.memoryLimit) {
    args.push(`--memory-limit=${options.memoryLimit}`);
  }

  if (options.xdebug) {
    args.push('--xdebug');
  }

  if (options.extraArgs.length > 0) {
    args.push(...options.extraArgs);
  }

  return args;
};
