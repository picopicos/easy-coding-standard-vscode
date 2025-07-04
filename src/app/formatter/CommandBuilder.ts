import type { ECSConfig } from '../../Configuration';

export class CommandBuilder {
  create(config: ECSConfig, filePath: string): string[] {
    const args = ['check'];

    if (config.configPath) {
      args.push('--config', config.configPath);
    }

    args.push(filePath);

    args.push('--output-format=json');

    args.push('--no-interaction');
    args.push('--no-progress-bar');
    args.push('--no-ansi');

    if (config.clearCache) {
      args.push('--clear-cache');
    }

    if (config.memoryLimit) {
      args.push(`--memory-limit=${config.memoryLimit}`);
    }

    if (config.xdebug) {
      args.push('--xdebug');
    }

    if (config.debug) {
      args.push('--debug');
    }

    return args;
  }
}
