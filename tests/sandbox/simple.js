#!/usr/bin/env node
const { cli, help } = require('../../lib/index')

const withHelp = help

cli(withHelp((options, p1, p2) => {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}, 'Basic script description', {
  params: ['p1', 'p2'],
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  },
  examples: 'some examples'
}))
