import { CLICommandNotFound } from './errors'

export interface ICLIOptions {
  [key: string]: number | string | boolean
}

export type CommandFunction = (options: ICLIOptions, ...args: any[]) => any

export interface ICommandsDictionary {
  [namespace: string]: CommandsModule
}

export interface IInterpreterArguments {
  options: ICLIOptions
  params: CLIParams
  commandsModule: CommandsModule
  middleware?: Middleware
}

export type CLIParams = string[]

export type CommandsModule = ICommandsDictionary | CommandFunction

export type Middleware = (command: CommandFunction) => CommandFunction

export function interpret({
  options,
  params,
  commandsModule,
  middleware = command => command
}: IInterpreterArguments): any {
  if (typeof commandsModule === 'function') {
    return middleware(commandsModule)(options, ...params)
  }

  const nextNamespace = params[0]
  const nextParams = params.slice(1)
  const nextModule = commandsModule[nextNamespace]
  const defaultCommand = commandsModule.default

  if (nextModule) {
    return interpret({
      commandsModule: nextModule,
      options,
      params: nextParams
    })
  }
  if (defaultCommand) {
    return interpret({
      commandsModule: defaultCommand,
      options,
      params
    })
  }

  throw new CLICommandNotFound(nextNamespace)
}
