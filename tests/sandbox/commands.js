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
  params: ['p1', 'p2'],
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  }
})
async function status (options, p1, p2) {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
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
