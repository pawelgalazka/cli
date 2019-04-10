import { CLIError, Middleware } from '../index'
import { ILogger } from '../utils/logger'

export const errorsHandler: (
  logger: ILogger
) => Middleware = logger => next => args => {
  try {
    next(args)
  } catch (error) {
    if (error instanceof CLIError) {
      logger.error(error.message)
      process.exit(1)
    } else {
      logger.log(error)
      process.exit(1)
    }
  }
}
