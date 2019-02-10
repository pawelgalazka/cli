#!/usr/bin/env node
const { cli, help } = require('../../lib/index')

help(main, {
  description: 'Basic script description',
  params: ['p1', 'p2'],
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  },
  examples: 'some examples'
})

function main (options, p1, p2) {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}

cli({
  default: main
})
