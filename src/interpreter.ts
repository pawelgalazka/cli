import { get } from 'lodash'
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
  middlewares?: Middleware[]
}

export type CLIParams = string[]

export type CommandsModule = ICommandsDictionary | CommandFunction

export type Middleware = (command: CommandFunction) => CommandFunction

export function interpret({
  options,
  params,
  commandsModule,
  middlewares = []
}: IInterpreterArguments): any {
  if (typeof commandsModule === 'function') {
    return commandsModule(options, ...params)
  }

  const commandName = (params[0] || '').replace(/:/g, '.')
  const nextParams = params.slice(1)

  const command: CommandsModule | undefined = get(commandsModule, commandName)

  if (typeof command === 'function') {
    return command(options, ...nextParams)
  }

  if (typeof command === 'object') {
    const defaultCommand = command.default

    if (typeof defaultCommand === 'function') {
      return defaultCommand(options, ...nextParams)
    }
  }

  if (typeof command === 'undefined') {
    const defaultCommand = commandsModule.default

    if (typeof defaultCommand === 'function') {
      return defaultCommand(options, ...params)
    }
  }

  throw new CLICommandNotFound()
}
