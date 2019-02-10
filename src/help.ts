import chalk from 'chalk'
import { capitalize, forEach, isEmpty, omit, padEnd } from 'lodash'
import path from 'path'

import { ILogger } from './logger'
import { IOptions } from './parse'
import { optionToString } from './utils'

export interface IAnnoations {
  description?: string
  params?: string[]
  options?: IOptions
  [key: string]: any
}

export type PrintHelp = (
  scriptName: string,
  annotations: IAnnoations,
  logger: ILogger
) => void | null

export function printHelp(
  scriptName: string,
  annotations: IAnnoations,
  logger: ILogger
): null | void {
  if (isEmpty(annotations)) {
    logger.log('Documentation not found')
    return null
  }

  const { description, params, options } = annotations
  const extra = omit(annotations, ['description', 'params', 'options'])
  const usageOptions = isEmpty(options) ? '' : '[options]'
  const usageParams =
    !Array.isArray(params) || isEmpty(params) ? '' : `[${params.join(' ')}]`

  logger.log(
    `Usage: ${path.basename(scriptName)} ${usageOptions} ${usageParams}\n`
  )

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

export function printAllHelp(obj: any, logger: ILogger, namespace?: string) {
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    const nextNamespace = namespace ? `${namespace}:${key}` : key
    const help = value.help

    if (typeof value === 'function') {
      // Add task name
      const funcParams = help && help.params
      const logArgs = [chalk.bold(nextNamespace)]

      // Add task params
      if (Array.isArray(funcParams) && funcParams.length) {
        logArgs[0] += ` [${funcParams.join(' ')}]`
      }

      // Add description
      if (help && (help.description || typeof help === 'string')) {
        const description = help.description || help
        logArgs[0] = padEnd(logArgs[0], 40) // format
        logArgs.push('-', description.split('\n')[0])
      }

      // Log
      logger.log(...logArgs)
    } else if (typeof value === 'object') {
      printAllHelp(value, logger, nextNamespace)
    }
  })
}
