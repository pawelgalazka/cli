import { CommandsTreeNode, ICLIOptions, ICommandFunction } from './interpreter'
import { ILogger } from './logger'

export interface IHelpDetailedAnnoations {
  description?: string
  params?: string[]
  options?: ICLIOptions
  [key: string]: any
}

export interface IPrintHelpArguments {
  node: CommandsTreeNode
  namespace: string
  logger: ILogger
}

export type HelpAnnotations = string | IHelpDetailedAnnoations

export type PrintHelp = (args: IPrintHelpArguments) => void

export function printHelp({ node, namespace, logger }: IPrintHelpArguments) {
  console.log('test')
}

export function help(command: ICommandFunction, annotations?: HelpAnnotations) {
  // Because the validation above currently gets compiled out,
  // Explictly  validate the function input
  if (typeof command === 'function') {
    command.help = annotations
  } else {
    throw new Error('First help() argument must be a function')
  }
}
