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

    it('handles script based on commands', () => {
      expect(execSync(`${scriptPath} status --help`).toString())
        .toEqual(dedent`Usage: status [options] [p]
  
          Fake git status
  
          Options:
  
            --foo       foo option\n`)
    })
  })
})
