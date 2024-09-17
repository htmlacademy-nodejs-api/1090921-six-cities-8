import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';

import { Command, PackageJSONConfig } from './types/index.js';

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = 'package.json'
  ) {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    this.checkIfValidPackageJSON(importedContent);

    return importedContent.version;
  }

  private checkIfValidPackageJSON (value: unknown): asserts value is PackageJSONConfig {
    if (!(
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.hasOwn(value, 'version')
    )) {
      throw new Error('Failed to parse json content.');
    }
  }

  public getName(): string {
    return '--version';
  }

  public execute(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      console.info(chalk.greenBright(version));
    } catch (error) {
      console.error(chalk.redBright(`Failed to read version from ${this.filePath}`));
      console.error(error);
    }
  }
}
