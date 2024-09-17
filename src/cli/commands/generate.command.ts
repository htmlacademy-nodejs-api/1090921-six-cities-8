import got from 'got';
import chalk from 'chalk';

import { Command } from './types/command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { RADIX } from '../../shared/helpers/index.js';

export class GenerateCommand implements Command {
  private initialData!: MockServerData;
  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    if (!this.initialData) {
      throw new Error('Data was not loaded');
    }
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    try {
      const [count, filepath, url] = parameters;
      if (!count || !filepath || !url) {
        throw new Error('Specify missing parameters');
      }

      const offerCount = Number.parseInt(count, RADIX);

      await this.load(url);
      await this.write(filepath, offerCount);

      console.info(`File ${filepath} was created!`);
    } catch (error) {
      console.error(chalk.red('Can\'t generate data'));
      console.error(error);
    }
  }
}
