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
  console.log('default command exec')
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}

help(simplecmd, 'Simple command', {
  params: ['p1', 'p2'],
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  }
})
async function simplecmd (options, p1, p2) {
  console.log('simple command exec')
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}

help(errcmd, 'Error command')
function errcmd () {
  throw new Error('test error')
}

help(asyncawaitcmd, 'Async/await command')
async function asyncawaitcmd (options, p1, p2) {
  console.log('async/await command exec')
  console.log('OPTIONS', options)
  await Promise.resolve().then(() => {
    console.log('P1', p1)
  })
  console.log('P2', p2)
}

cli({
  default: main,
  simplecmd,
  errcmd,
  asyncawaitcmd
})
