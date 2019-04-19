import { CLIError, Middleware } from '../index'

export const commandCaller: Middleware = next => args => {
  const { command, options, params, reject } = args
  if (!command) {
    throw new CLIError('Command not found')
  }
  Promise.resolve(command(options, ...params))
    .then(() => {
      next(args)
    })
    .catch(reject)
}
