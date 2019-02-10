import cliArgs from '@pawelgalazka/cli-args'
import { isString } from 'lodash'
import path from 'path'

import { CLICommandNotFound } from './errors'
import { IAnnoations, PrintHelp, printHelp } from './help'
import { ILogger } from './logger'
import { validate } from './validate'

export interface IOptions {
  [key: string]: number | string | boolean
}

type CliCallback = (options: IOptions, ...params: string[]) => any

export function parseCommand(
  argv: string[],
  annotations: IAnnoations | string = {},
  help: PrintHelp = printHelp,
  logger: ILogger = console
) {
  return (callback: CliCallback) => {
    const { params, options } = cliArgs(argv.slice(2))
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

export function parseAllCommands(
  obj: any,
  args: string[],
  logger?: ILogger,
  subtaskName?: string
) {
  const taskName = subtaskName || args[2]

  if (typeof obj[taskName] === 'function') {
    const command = parseCommand(
      args.slice(1),
      obj[taskName].help,
      undefined,
      logger as any
    )

    command((options, ...params) => {
      obj[taskName](options, ...params)
    })
    return obj[taskName]
  }

  const namespaces = taskName.split(':')
  const rootNamespace = namespaces.shift() || ''
  const nextSubtaskName = namespaces.join(':')

  if (obj[rootNamespace]) {
    const calledTask: any = parseAllCommands(
      obj[rootNamespace],
      args,
      logger,
      nextSubtaskName
    )
    if (calledTask) {
      return calledTask
    }
  }

  if (!subtaskName) {
    if (typeof obj.default === 'function') {
      const command = parseCommand(
        args,
        obj.default.help,
        undefined,
        logger as any
      )

      command((options, ...params) => {
        obj.default(options, ...params)
      })
      return obj[taskName]
    }

    throw new CLICommandNotFound(`Command ${taskName} not found`)
  }
}
