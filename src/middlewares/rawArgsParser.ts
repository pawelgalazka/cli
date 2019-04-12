import { Middleware } from '../index'

let rawArgsValue: string[] = []

export function rawArgs() {
  return rawArgsValue
}

export const rawArgsParser: (
  argv: string[]
) => Middleware = argv => next => args => {
  const { namespace } = args

  rawArgsValue = namespace ? argv.slice(3) : argv.slice(2)

  next(args)
}
