import { execSync } from 'child_process'
// tslint:disable-next-line:no-implicit-dependencies
import dedent from 'dedent'

describe('cli', () => {
  let scriptPath: string
  describe('basic version', () => {
    beforeEach(() => {
      scriptPath = './tests/sandbox/simple.js'
    })

    it('executes the implementation', () => {
      expect(execSync(`${scriptPath} -a --foo=bar abc def`).toString())
        .toEqual(dedent`OPTIONS { a: true, foo: 'bar' }
          P1 abc
          P2 def\n`)
    })

    it('prints help', () => {
      expect(execSync(`${scriptPath} --help`).toString())
        .toEqual(dedent`Usage: simple.js [options] [p1 p2]
  
        Basic script description

        Options:

          -a          description for a option
          --foo       description for foo option

        Examples:
        
        some examples\n\n`)
    })
  })

  describe('with commands', () => {
    beforeEach(() => {
      scriptPath = './tests/sandbox/commands.js'
    })

    it('executes default command implementation', () => {
      expect(execSync(`${scriptPath} -a --foo=bar abc def`).toString())
        .toEqual(dedent`default command exec
        OPTIONS { a: true, foo: 'bar' }
        P1 abc
        P2 def\n`)
    })

    it('executes command implementation', () => {
      expect(
        execSync(`${scriptPath} simplecmd -a --foo=bar abc def`).toString()
      ).toEqual(dedent`simple command exec
          OPTIONS { a: true, foo: 'bar' }
          P1 abc
          P2 def\n`)
    })

    it('prints help', () => {
      expect(execSync(`${scriptPath} simplecmd --help`).toString())
        .toEqual(dedent`Usage: simplecmd [options] [p1 p2]
  
        Simple command
  
        Options:

          -a          description for a option
          --foo       description for foo option\n`)
    })
  })
})
