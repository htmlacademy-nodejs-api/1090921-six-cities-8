import chalk from 'chalk';
import { Command } from './types/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    try {
      const [filename] = parameters;
      if (!filename) {
        throw new Error('Pass the correct path to file as the 1st argument');
      }

      const fileReader = new TSVFileReader(filename.trim());
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (err instanceof Error) {
        console.error(chalk.red(`Error: ${err.message}`));
      }
    }
  }
}
