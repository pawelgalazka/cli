import microargs from '@pawelgalazka/cli-args'
import { difference, isString } from 'lodash'
import path from 'path'

import { CLIError } from './errors'
import { IAnnoations, printHelp, PrintHelp } from './help'
import { ILogger } from './logger'
import { IOptions } from './parse'
import { optionsToString } from './utils'

export { CLIError } from './errors'

type CliCallback = (options: IOptions, ...params: string[]) => any

export function cli(
  argv: string[],
  annotations: IAnnoations | string = {},
  help: PrintHelp = printHelp,
  logger: ILogger = console
) {
  return (callback: CliCallback) => {
    const { params, options } = microargs(argv.slice(2))
    const scriptName = path.basename(argv[1])

    if (isString(annotations)) {
      annotations = {
        description: annotations
      }
    }

    if (options.help) {
      return help(scriptName, annotations, logger)
    }

    const annotatedOptionsKeys =
      (annotations &&
        annotations.options &&
        Object.keys(annotations.options)) ||
      []
    const optionsKeys = Object.keys(options)
    const illegalOptionsKeys = difference(optionsKeys, annotatedOptionsKeys)

    if (annotatedOptionsKeys.length && illegalOptionsKeys.length) {
      const msg =
        `Illegal option: ${optionsToString(illegalOptionsKeys)}\n` +
        `Available options: ${optionsToString(annotatedOptionsKeys)}\n` +
        `Type "${scriptName} --help" for more information`
      throw new CLIError(msg)
    }

    return callback(options, ...params)
  }
}
