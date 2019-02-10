import { execSync } from 'child_process'
// tslint:disable-next-line:no-implicit-dependencies
import dedent from 'dedent'

describe('cli e2e', () => {
  it('handles simple script', () => {
    expect(
      execSync('./tests/sandbox/simple.js -a --foo=bar abc def').toString()
    ).toEqual(dedent`OPTIONS { a: true, foo: 'bar' }
      P1 abc
      P2 def\n`)
  })

  it('handles script based on commands', () => {
    expect(execSync('./tests/sandbox/commands.js status --help').toString())
      .toEqual(dedent`Usage: status [options] [p]

        Fake git status

        Options:

          --foo       foo option\n`)
  })
})
