#!/usr/bin/env node
const microcli = require('../index')
const command = name => name === process.argv[2]

const main = microcli(process.argv, {
  description: 'base command',
  params: ['p'],
  options: {
    foo: 'foo option'
  }
})

const status = microcli(process.argv.slice(1), {
  description: 'Fake git status',
  params: ['p'],
  options: {
    foo: 'foo option'
  }
})

const branch = microcli(process.argv.slice(1), {
  description: 'Fake git branch',
  params: ['p'],
  options: {
    foo: 'foo option'
  }
})

command('status') && status((options, p) => {
  console.log('OPTIONS', options)
  console.log('P', p)
})

command('branch') && branch((options, p) => {
  console.log('OPTIONS', options)
  console.log('P', p)
})

main((options, p) => {
  console.log('OPTIONS', options)
  console.log('P', p)
})
