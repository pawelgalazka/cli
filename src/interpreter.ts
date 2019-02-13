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

export interface ICommandsTree {
  [namespace: string]: CommandsTreeNode
}

export interface IInterpreterArguments {
  options: ICLIOptions
  params: CLIParams
  node: CommandsTreeNode
  namespace: string
  logger: ILogger
}

export type CLIParams = string[]

export type CommandsTreeNode = ICommandsTree | ICommandFunction

export function interpret({
  options,
  params,
  node,
  namespace,
  logger
}: IInterpreterArguments): any {
  if (typeof node === 'function') {
    const command = node
    if (options.help) {
      return printHelp({ node, namespace, logger })
    } else {
      validate({ command, options, namespace })
      return command(options, ...params)
    }
  }

  const nextNamespace = params[0]
  const nextParams = params.slice(1)
  const nextNode = node[nextNamespace]
  const defaultCommand = node.default

  if (nextNode) {
    return interpret({
      logger,
      namespace: nextNamespace,
      node: nextNode,
      options,
      params: nextParams
    })
  }
  if (defaultCommand) {
    if (options.help) {
      printHelp({ node, namespace, logger })
    }
    return interpret({
      logger,
      namespace,
      node: defaultCommand,
      options,
      params: nextParams
    })
  }

  throw new CLICommandNotFound(namespace || nextNamespace)
}
