import chalk from 'chalk'
import { capitalize, forEach, isEmpty, omit, padEnd } from 'lodash'

import {
  CommandsTreeNode,
  ICommandFunction,
  ICommandsTree
} from './interpreter'
import { ILogger } from './logger'
import { optionToString } from './utils'

export interface IOptionsAnnotations {
  [optionName: string]: string
}

export interface IHelpDetailedAnnoations {
  description?: string
  params?: string[]
  options?: IOptionsAnnotations
  [key: string]: any
}

export interface IPrintHelpArguments {
  node: CommandsTreeNode
  namespace: string
  logger: ILogger
}

interface IPrintCommandHelpArguments {
  command: ICommandFunction
  namespace: string
  logger: ILogger
}

interface IPrintNamespaceHelpArguments {
  commands: ICommandsTree
  namespace: string
  logger: ILogger
}

export type HelpAnnotations = string | IHelpDetailedAnnoations

export type PrintHelp = (args: IPrintHelpArguments) => void

function printCommandHelp({
  command,
  namespace,
  logger
}: IPrintCommandHelpArguments) {
  if (!command.help) {
    logger.log('Documentation not found')
    return
  }

  let annotations: IHelpDetailedAnnoations = {}

  if (typeof command.help === 'string') {
    annotations.description = command.help
  } else {
    annotations = command.help
  }

  const { description, params, options } = annotations
  const extra = omit(annotations, ['description', 'params', 'options'])
  const usageOptions = isEmpty(options) ? '' : '[options]'
  const usageParams =
    !Array.isArray(params) || isEmpty(params) ? '' : `[${params.join(' ')}]`

  logger.log(`Usage: ${namespace} ${usageOptions} ${usageParams}\n`)

  if (description) {
    logger.log(`${description}\n`)
  }

  if (!isEmpty(options)) {
    logger.log('Options:\n')
    forEach(options, (value, key) => {
      logger.log(`  ${padEnd(optionToString(key), 12)}${value}`)
    })
  }

  forEach(extra, (value, key) => {
    logger.log(`\n${capitalize(key)}:\n`)
    logger.log(`${value}\n`)
  })
}

function printNamespaceHelp({
  commands,
  namespace,
  logger
}: IPrintNamespaceHelpArguments) {
  Object.keys(commands)
    .sort()
    .forEach(key => {
      const node = commands[key]
      const nextNamespace = namespace ? `${namespace}:${key}` : key

      if (typeof node === 'function') {
        let annotations = node.help

        if (typeof annotations === 'string') {
          annotations = { description: annotations }
        }
        // Add task name
        const funcParams = annotations && annotations.params
        const logArgs = [chalk.bold(nextNamespace)]

        // Add task params
        if (Array.isArray(funcParams) && funcParams.length) {
          logArgs[0] += ` [${funcParams.join(' ')}]`
        }

        // Add description
        if (annotations && annotations.description) {
          const description = annotations.description
          logArgs[0] = padEnd(logArgs[0], 40) // format
          logArgs.push('-', description.split('\n')[0])
        }

        // Log
        logger.log(...logArgs)
      } else if (typeof node === 'object') {
        printNamespaceHelp({ commands: node, logger, namespace: nextNamespace })
      }
    })
}

export function printHelp({ node, namespace, logger }: IPrintHelpArguments) {
  if (typeof node === 'function') {
    printCommandHelp({ command: node, namespace, logger })
  } else {
    printNamespaceHelp({ commands: node, namespace, logger })
  }
}

export function help(command: ICommandFunction, annotations: HelpAnnotations) {
  // Because the validation above currently gets compiled out,
  // Explictly  validate the function input
  if (typeof command === 'function') {
    command.help = annotations
  } else {
    throw new Error('First help() argument must be a function')
  }
}
