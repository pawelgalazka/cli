import { Middleware } from '../index'

export const commandCaller: Middleware = next => args => {
  const { command, options, params, error } = args
  Promise.resolve(command(options, ...params))
    .then(() => {
      next(args)
    })
    .catch(err => {
      error(err)
    })
}
