import cliArgs from '@pawelgalazka/cli-args'

import { Middleware } from '../index'

export const argsParser: (
  argv: string[]
) => Middleware = argv => next => args => {
  const { params, options } = cliArgs(argv.slice(2))
  next({
    ...args,
    options,
    params
  })
}
