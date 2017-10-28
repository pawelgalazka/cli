const path = require('path')
const microargs = require('microargs')
const { get, difference, isEmpty, padEnd, forEach, capitalize, omit } = require('lodash')

function optionToString (optionName) {
  return optionName.length === 1 ? `-${optionName}` : `--${optionName}`
}

function optionsToString (optionsKeys) {
  return optionsKeys.map(optionToString).join(' ')
}

function printHelp (scriptName, annotations, logger) {
  if (isEmpty(annotations)) {
    return null
  }

  const { description, params, options } = annotations
  const extra = omit(annotations, ['description', 'params', 'options'])
  const usageOptions = isEmpty(options) ? '' : '[options]'
  const usageParams = isEmpty(params) ? '' : `[${params.join(' ')}]`

  logger.log(`Usage: ${path.basename(scriptName)} ${usageOptions} ${usageParams}\n`)

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

module.exports = (argv, annotations = {}, help, logger = console) => {
  help = help || printHelp
  const { params, options } = microargs(argv.slice(2))
  const scriptName = path.basename(argv[1])
  const annotatedOptionsKeys = (get(annotations, 'options') && Object.keys(annotations.options)) || []
  const optionsKeys = Object.keys(options)
  const illegalOptionsKeys = difference(optionsKeys, annotatedOptionsKeys)

  if (!options.help && annotatedOptionsKeys.length && illegalOptionsKeys.length) {
    const errorMessage = `Illegal option: ${optionsToString(illegalOptionsKeys)}\n` +
      `Available options: ${optionsToString(annotatedOptionsKeys)}\n` +
      `Type "${scriptName} --help" for more information`
    throw new Error(errorMessage)
  }

  return (callback) => {
    if (options.help) {
      return help(scriptName, annotations, logger)
    }

    return callback(options, ...params)
  }
}
