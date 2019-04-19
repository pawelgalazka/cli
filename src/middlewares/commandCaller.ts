import { basename } from 'path'

import { CLIError, Middleware } from '../index'

export const commandCaller: (
  argv: string[]
) => Middleware = argv => next => args => {
  const { command, options, params, reject } = args
  if (!command) {
    const scriptName = basename(argv[1])
    throw new CLIError(
      `Command not found. Type "${scriptName} --help" for more information.`
    )
  }
  Promise.resolve(command(options, ...params))
    .then(() => {
      next(args)
    })
    .catch(reject)
}
