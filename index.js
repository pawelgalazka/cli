const microargs = require('microargs')

module.exports = (argv) => {
  const { params, options } = microargs(argv.slice(1))
  return (callback) => {
    callback(options, ...params)
  }
}