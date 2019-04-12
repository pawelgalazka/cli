#!/usr/bin/env node
const { cli, help } = require('../../lib/index')

help(main, {
  description: 'base command',
  params: ['p'],
  options: {
    foo: 'foo option'
  }
})
function main (options, p) {
  console.log('OPTIONS', options)
  console.log('P', p)
}

help(status, {
  description: 'Fake git status',
  params: ['p'],
  options: {
    foo: 'foo option'
  }
})
async function status (options, p) {
  console.log('OPTIONS', options)
  console.log('P', p)
  throw new Error('abc')
}

help(branch, {
  description: 'Fake git branch',
  params: ['p'],
  options: {
    foo: 'foo option'
  }
})
function branch (options, p) {
  console.log('OPTIONS', options)
  console.log('P', p)
}

cli({
  default: main,
  status,
  branch
})
