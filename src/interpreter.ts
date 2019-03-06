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
  commandsModule: CommandsModule
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
  commandsModule,
  namespace,
  logger,
  middleware = command => command
}: IInterpreterArguments): any {
  if (typeof commandsModule === 'function') {
    commandsModule.namespace = namespace
    return middleware(commandsModule)(options, ...params)
  }

  const nextNamespace = params[0]
  const nextParams = params.slice(1)
  const nextModule = commandsModule[nextNamespace]
  const defaultCommand = commandsModule.default

  if (nextModule) {
    return interpret({
      commandsModule: nextModule,
      logger,
      namespace: nextNamespace,
      options,
      params: nextParams
    })
  }
  if (defaultCommand) {
    return interpret({
      commandsModule: defaultCommand,
      logger,
      namespace,
      options,
      params: nextParams
    })
  }

  throw new CLICommandNotFound(namespace || nextNamespace)
}
