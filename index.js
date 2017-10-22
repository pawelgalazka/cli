const microargs = require('microargs')
const { get, difference } = require('lodash')

function optionsToString(optionsKeys) {
  return optionsKeys.map((optionName) => {
    return optionName.length === 1 ? `-${optionName}` : `--${optionName}`
  }).join(' ')
}

function printHelp(annotations) {

}

module.exports = (argv, annotations = {}, printHelp = printHelp, logger = console) => {
  const { params, options } = microargs(argv.slice(1))
  const scriptName = argv[0]
  const annotatedOptionsKeys = get(annotations, 'options') && Object.keys(annotations.options) || []
  const optionsKeys = Object.keys(options)
  const illegalOptionsKeys = difference(optionsKeys, annotatedOptionsKeys)

  return (callback) => {
    if (annotatedOptionsKeys.length && illegalOptionsKeys.length) {
      const errorMessage = `Illegal option: ${optionsToString(illegalOptionsKeys)}\n` +
        `Available options: ${optionsToString(annotatedOptionsKeys)}\n` +
        `Type "${scriptName} --help" for more information`
      throw new Error(errorMessage)
    }

    callback(options, ...params)
  }
}
