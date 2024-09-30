import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';

import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';

const RETRY = {
  COUNT: 5,
  TIMEOUT: 1000,
};

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public get isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase) {
      throw new Error('MongoDB client already connected');
    }

    let attempt = 0;
    while (attempt < RETRY.COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY.TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY.COUNT}`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
