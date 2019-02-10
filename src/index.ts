import { CLICommandNotFound, CLIError } from './errors'
import { printAllHelp } from './help'
import { Logger } from './logger'
import { parseAllCommands } from './parse'

export function cli(tasksfile: any) {
  const logger = new Logger()
  try {
    const ARGV = process.argv.slice()

    if (ARGV.length > 2) {
      parseAllCommands(tasksfile, ARGV, logger)
    } else {
      printAllHelp(tasksfile, logger)
    }
  } catch (error) {
    if (error instanceof CLICommandNotFound || error instanceof CLIError) {
      logger.error(error.message)
      process.exit(1)
    } else {
      logger.log(error)
      process.exit(1)
    }
  }
}
