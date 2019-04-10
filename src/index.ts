import { middleware, Middleware as GenericMiddleware } from './utils/middleware'

export { help } from './middlewares/helper'

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
}

export class CLIError extends Error {}

export function cli(
  definition: CommandsModule,
  middlewares: Middleware[] = []
) {
  middleware<IMiddlewareArguments>(middlewares)({
    command: () => null,
    definition,
    namespace: '',
    options: {},
    params: []
  })
}
