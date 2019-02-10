import microargs from '@pawelgalazka/cli-args'
import { isString } from 'lodash'
import path from 'path'

import { IAnnoations, printHelp, PrintHelp } from './help'
import { ILogger } from './logger'
import { IOptions } from './parse'
import { validate } from './validate'
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

    validate(annotations, options, scriptName)

    return callback(options, ...params)
  }
}
