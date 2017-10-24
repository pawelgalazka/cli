#!/usr/bin/env node
const microcli = require('../index')
const cli = microcli(process.argv, {
  description: 'Basic script description',
  params: {
    p1: 'description for p1 param',
    p2: 'description for p2 param'
  },
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  }
});

cli((options, p1, p2) => {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
})
