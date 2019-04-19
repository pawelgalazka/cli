import chalk from 'chalk'
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

    it('fails on command with error', () => {
      expect(() => {
        execSync(`${scriptPath} errcmd`)
      }).toThrow()
    })

    it('executes async command', () => {
      expect(
        execSync(`${scriptPath} asyncawaitcmd -a --foo=bar abc def`).toString()
      ).toEqual(dedent`async/await command exec
          OPTIONS { a: true, foo: 'bar' }
          P1 abc
          P2 def\n`)
    })

    it('executes nested command', () => {
      expect(
        execSync(
          `${scriptPath} nested:simplecmd -a --foo=bar abc def`
        ).toString()
      ).toEqual(dedent`nested command exec
          OPTIONS { a: true, foo: 'bar' }
          P1 abc
          P2 def\n`)
    })

    it('throws "Command not found" error if command not found', () => {
      expect(() =>
        execSync(`${scriptPath} nested -a --foo=bar abc def`).toString()
      ).toThrow('Command not found')
    })

    it('fails on async command with error', () => {
      expect(() => {
        execSync(`${scriptPath} asyncawaiterrcmd`)
      }).toThrow()
    })

    it('prints help', () => {
      expect(execSync(`${scriptPath} simplecmd --help`).toString())
        .toEqual(dedent`Usage: simplecmd [options] [p1 p2]
  
        Simple command
  
        Options:

          -a          description for a option
          --foo       description for foo option\n`)
    })

    it('prints help for default command', () => {
      expect(
        execSync(`${scriptPath} --help`, {
          env: { ...process.env, FORCE_COLOR: '0' }
        }).toString()
      ).toEqual(dedent`Usage: commands.js [options] [p1 p2]

      base command

      Options:

        -a          description for a option
        --foo       description for foo option

      Commands:

      asyncawaitcmd                            - Async/await command
      asyncawaiterrcmd                         - Async/await error command
      errcmd                                   - Error command
      nested:simplecmd                         - Nested command
      simplecmd [p1 p2]                        - Simple command\n`)
    })
  })
})
