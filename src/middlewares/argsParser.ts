import cliArgs from '@pawelgalazka/cli-args'

import { Middleware } from '../index'

export const argsParser: Middleware = next => args => {
  const { params, options } = cliArgs(process.argv.slice(2))
  next({
    ...args,
    options,
    params
  })
}
