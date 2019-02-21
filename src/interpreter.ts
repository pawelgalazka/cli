import { CLICommandNotFound } from './errors'
import { HelpAnnotations, printHelp } from './helper'
import { ILogger } from './logger'
import { validate } from './validator'

export interface ICLIOptions {
  [key: string]: number | string | boolean
}

export interface ICommandFunction {
  (...args: any[]): any
  help?: HelpAnnotations
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
}

export type CLIParams = string[]

export type CommandsModule = ICommandsDictionary | ICommandFunction

export function interpret({
  options,
  params,
  module,
  namespace,
  logger
}: IInterpreterArguments): any {
  if (typeof module === 'function') {
    const command = module
    if (options.help) {
      return printHelp({ module, namespace, logger })
    } else {
      validate({ command, options, namespace })
      return command(options, ...params)
    }
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
    if (options.help) {
      printHelp({ module, namespace, logger })
    }
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
