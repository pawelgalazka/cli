import { Middleware } from '../index'

export const commandCaller: Middleware = next => args => {
  const { command, options, params } = args
  command(options, ...params)
  next(args)
}
