#!/usr/bin/env node
const { cli, help } = require('../../lib/index')

help(main, 'base command', {
  params: ['p1', 'p2'],
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  }
})
function main (options, p1, p2) {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}

help(status, 'Fake git status', {
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

help(branch, 'Fake git branch', {
  params: ['p'],
  options: {
    foo: 'foo option'
  }
})
function branch (options, p1, p2) {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}

cli({
  default: main,
  status,
  branch
})
