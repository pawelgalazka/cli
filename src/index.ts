import microargs from "@pawelgalazka/cli-args"
import {
  capitalize,
  difference,
  forEach,
  isEmpty,
  isString,
  omit,
  padEnd
} from "lodash"
import path from "path"

class CLIError extends Error {}

type Logger = typeof console

interface IOptions {
  [key: string]: number | string | boolean
}

interface IAnnoations {
  description?: string
  params?: string[]
  options?: IOptions
  [key: string]: any
}

type PrintHelp = (
  scriptName: string,
  annotations: IAnnoations,
  logger: Logger
) => void | null

type CliCallback = (options: IOptions, ...params: string[]) => any

function optionToString(optionName: string) {
  return optionName.length === 1 ? `-${optionName}` : `--${optionName}`
}

function optionsToString(optionsKeys: string[]) {
  return optionsKeys.map(optionToString).join(" ")
}

function printHelp(
  scriptName: string,
  annotations: IAnnoations,
  logger: Logger
): null | void {
  if (isEmpty(annotations)) {
    logger.log("Documentation not found")
    return null
  }

  const { description, params, options } = annotations
  const extra = omit(annotations, ["description", "params", "options"])
  const usageOptions = isEmpty(options) ? "" : "[options]"
  const usageParams =
    !Array.isArray(params) || isEmpty(params) ? "" : `[${params.join(" ")}]`

  logger.log(
    `Usage: ${path.basename(scriptName)} ${usageOptions} ${usageParams}\n`
  )

  if (description) {
    logger.log(`${description}\n`)
  }

  if (!isEmpty(options)) {
    logger.log("Options:\n")
    forEach(options, (value, key) => {
      logger.log(`  ${padEnd(optionToString(key), 12)}${value}`)
    })
  }

  forEach(extra, (value, key) => {
    logger.log(`\n${capitalize(key)}:\n`)
    logger.log(`${value}\n`)
  })
}

const Cli = (
  argv: string[],
  annotations: IAnnoations | string = {},
  help: PrintHelp = printHelp,
  logger: Logger = console
) => {
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

Cli.CliError = CLIError

export = Cli
