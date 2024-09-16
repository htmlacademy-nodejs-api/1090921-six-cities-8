import chalk from 'chalk';
import { Command } from './types/index.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.blueBright(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии package.json
            --help:                      # выводит список доступных команд
            --import <path>:             # импортирует данные из TSV и выводит в консоль
            --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных
    `));
  }
}
