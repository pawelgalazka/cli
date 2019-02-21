import { CLICommandNotFound } from './errors'
import { ILogger } from './logger'

export interface ICLIOptions {
  [key: string]: number | string | boolean
}

export interface ICommandFunction {
  (options: ICLIOptions, ...args: any[]): any
  [key: string]: any
  namespace?: string
}

export interface ICommandsDictionary {
  [namespace: string]: CommandsModule
}

export interface IInterpreterArguments {
  options: ICLIOptions
  params: CLIParams
  module: CommandsModule
  namespace: string
  logger: ILogger
  middleware?: Middleware
}

export type CLIParams = string[]

export type CommandsModule = ICommandsDictionary | ICommandFunction

export type Middleware = (command: ICommandFunction) => ICommandFunction

export function interpret({
  options,
  params,
  module,
  namespace,
  logger,
  middleware = command => command
}: IInterpreterArguments): any {
  if (typeof module === 'function') {
    module.namespace = namespace
    return middleware(module)(options, ...params)
  }

  const nextNamespace = params[0]
  const nextParams = params.slice(1)
  const nextModule = module[nextNamespace]
  const defaultCommand = module.default

  if (nextModule) {
    return interpret({
      logger,
      module: nextModule,
      namespace: nextNamespace,
      options,
      params: nextParams
    })
  }
  if (defaultCommand) {
    return interpret({
      logger,
      module: defaultCommand,
      namespace,
      options,
      params: nextParams
    })
  }

  throw new CLICommandNotFound(namespace || nextNamespace)
}
