import { CLIError, Middleware } from '../index'
import { ILogger } from '../utils/logger'

export const errorsHandler: (
  logger: ILogger
) => Middleware = logger => next => args => {
  const error = (e: Error) => {
    if (e instanceof CLIError) {
      logger.error(e.message)
      process.exit(1)
    } else {
      logger.log(e)
      process.exit(1)
    }
  }
  try {
    next({
      ...args,
      error
    })
  } catch (e) {
    error(e)
  }
}
