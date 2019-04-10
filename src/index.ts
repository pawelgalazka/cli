import cliArgs from '@pawelgalazka/cli-args'

import { CLICommandNotFound, CLIIllegalOption } from './utils/errors'
import { CommandsModule, interpret } from './interpreter'
import { Logger } from './utils/logger'

export { help } from './middlewares/helper'

export function cli(commandsModule: CommandsModule) {
  const logger = new Logger()
  try {
    const { params, options } = cliArgs(process.argv.slice(2))

    interpret({ options, params, commandsModule })
  } catch (error) {
    if (
      error instanceof CLICommandNotFound ||
      error instanceof CLIIllegalOption
    ) {
      logger.error(error.message)
      process.exit(1)
    } else {
      logger.log(error)
      process.exit(1)
    }
  }
}
