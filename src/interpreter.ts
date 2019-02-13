import { CLICommandNotFound } from './errors'
import { IAnnoations } from './help'

export interface ICLIOptions {
  [key: string]: number | string | boolean
}

export interface ICommandFunction {
  (...args: any[]): any
  help?: string | IAnnoations
}

export interface ICommandsTree {
  [key: string]: CommandsTreeNode
}

export interface IInterpreterArguments {
  options: ICLIOptions
  params: CLIParams
  node: CommandsTreeNode
  namespace?: string
}

export type CLIParams = string[]

export type CommandsTreeNode = ICommandsTree | ICommandFunction

function helper(opts: any): any {
  return 1
}
export function interpret({
  options,
  params,
  node,
  namespace
}: IInterpreterArguments): any {
  if (typeof node === 'function') {
    const command = node
    if (options.help) {
      return helper({ command, namespace })
    } else {
      // validate({ command, options, params, namespace})
      return command(options, ...params)
    }
  }

  const nextNamespace = params[0]
  const nextParams = params.slice(1)
  const nextNode = node[nextNamespace]
  const defaultCommand = node.default

  if (nextNode) {
    return interpret({
      namespace,
      node: nextNode,
      options,
      params: nextParams
    })
  }
  if (defaultCommand) {
    if (options.help) {
      helper({ node, namespace })
    }
    return interpret({
      node: defaultCommand,
      options,
      params: nextParams
    })
  }

  throw new CLICommandNotFound(namespace || nextNamespace)
}
