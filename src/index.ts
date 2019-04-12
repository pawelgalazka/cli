import {
  middleware,
  Middleware as GenericMiddleware
} from '@pawelgalazka/middleware'
import {
  argsParser,
  commandCaller,
  commandFinder,
  errorsHandler,
  helper,
  rawArgsParser,
  validator
} from './middlewares'
import { Logger } from './utils/logger'

export { help } from './middlewares/helper'
export { rawArgs } from './middlewares/rawArgsParser'

export type CommandFunction = (options: ICLIOptions, ...args: any[]) => any
export type CLIParams = string[]
export type CommandsModule = ICommandsDictionary | CommandFunction
export type Middleware = GenericMiddleware<IMiddlewareArguments>

export interface ICLIOptions {
  [key: string]: number | string | boolean
}

export interface ICommandsDictionary {
  [namespace: string]: CommandsModule
}

export interface IMiddlewareArguments {
  options: ICLIOptions
  params: CLIParams
  definition: CommandsModule
  namespace: string
  command: CommandFunction
  reject: (error: Error) => void
}

export class CLIError extends Error {}

export function useMiddlewares(middlewares: Middleware[] = []) {
  const logger = new Logger()
  const argv = process.argv
  const defaultMiddlewares = [
    errorsHandler(logger),
    argsParser,
    commandFinder,
    helper(logger),
    validator,
    rawArgsParser(argv),
    commandCaller
  ]
  const nextMiddlewares = defaultMiddlewares.concat(middlewares)
  return nextMiddlewares
}

export function cli(
  definition: CommandsModule,
  middlewares: Middleware[] = useMiddlewares()
) {
  middleware<IMiddlewareArguments>(middlewares)({
    command: () => null,
    definition,
    namespace: '',
    options: {},
    params: [],
    reject: error => {
      throw error
    }
  })
}
