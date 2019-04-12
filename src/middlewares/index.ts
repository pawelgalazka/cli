import { Middleware } from '../index'
import { Logger } from '../utils/logger'
import { argsParser } from './argsParser'
import { commandCaller } from './commandCaller'
import { commandFinder } from './commandFinder'
import { errorsHandler } from './errorsHandler'
import { helper } from './helper'
import { rawArgsParser } from './rawArgsParser'
import { validator } from './validator'

export function useMiddlewares(middlewares: Middleware[] = []) {
  const logger = new Logger()
  const argv = process.argv
  return [
    errorsHandler(logger),
    argsParser,
    commandFinder,
    helper(logger),
    validator,
    rawArgsParser(argv),
    ...middlewares,
    commandCaller
  ]
}
