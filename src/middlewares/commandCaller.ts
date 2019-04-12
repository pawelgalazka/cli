import { Middleware } from '../index'

export const commandCaller: Middleware = next => args => {
  const { command, options, params, reject } = args
  Promise.resolve(command(options, ...params))
    .then(() => {
      next(args)
    })
    .catch(reject)
}
