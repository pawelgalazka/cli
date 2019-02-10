import chalk from 'chalk'

export interface ILogger {
  log(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
}

export class Logger implements ILogger {
  public title(...args: any[]) {
    console.log(chalk.bold(...args))
  }
  public log(...args: any[]) {
    console.log(...args)
  }
  public warn(...args: any[]) {
    console.warn(chalk.yellow(...args))
  }
  public error(...args: any[]) {
    console.error(chalk.red(...args))
  }
}
