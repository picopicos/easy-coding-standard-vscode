import { describe, expect, it } from 'vitest';
import { type CommandOptions, createCommand } from './command';

describe('createCommand', () => {
  it.each<{
    testCase: string;
    commandOptions: CommandOptions;
    expectedCommand: string[];
  }>([
    {
      testCase: 'should create a command without optional parameters',
      commandOptions: {
        filePath: 'test.php',
        configPath: 'ecs.php',
        extraArgs: [],
      },
      expectedCommand: [
        'check',
        'test.php',
        '--config',
        'ecs.php',
        '--output-format=json',
        '--no-interaction',
        '--no-progress-bar',
        '--no-ansi',
      ],
    },
    {
      testCase: 'should create a command with optional parameters',
      commandOptions: {
        filePath: 'test.php',
        configPath: 'ecs.php',
        memoryLimit: '1024M',
        xdebug: true,
        extraArgs: ['--clear-cache'],
      },
      expectedCommand: [
        'check',
        'test.php',
        '--config',
        'ecs.php',
        '--output-format=json',
        '--no-interaction',
        '--no-progress-bar',
        '--no-ansi',
        '--memory-limit=1024M',
        '--xdebug',
        '--clear-cache',
      ],
    },
  ])('$testCase', ({ commandOptions, expectedCommand }) => {
    const command = createCommand(commandOptions);

    expect(command).toEqual(expectedCommand);
  });

  it('should start with check', () => {
    const command = createCommand({
      filePath: 'test.php',
      configPath: 'ecs.php',
      extraArgs: [],
    });

    expect(command[0]).toBe('check');
  });
});
