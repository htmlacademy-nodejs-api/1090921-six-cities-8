import chalk from 'chalk';
import { Command } from './types/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import type { Offer } from '../../shared/types/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';

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
      fileReader.on('line', this.onImportedOffer);
      fileReader.on('end', this.onCompleteImport);

      fileReader.read();
    } catch (err) {
      console.error(chalk.red(getErrorMessage(err)));
    }
  }
  
  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }
}
