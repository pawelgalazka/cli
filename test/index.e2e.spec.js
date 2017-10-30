/* eslint-env jest */
const { execSync } = require('child_process')
const dedent = require('dedent')

describe('microcli e2e', () => {
  it('handles simple script', () => {
    expect(execSync('./test/scripts/simple.js -a --foo=bar abc def').toString())
      .toEqual(dedent`OPTIONS { a: true, foo: 'bar' }
      P1 abc
      P2 def\n`)
  })

  it('handles script based on commands', () => {
    expect(execSync('./test/scripts/commands.js status --help').toString())
      .toEqual(dedent`Usage: status [options] [p]

        Fake git status

        Options:

          --foo       foo option\n`)
  })
})
