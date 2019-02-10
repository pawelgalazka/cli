import { CLICommandNotFound } from '../../src/errors'
import { parseAllCommands, parseCommand } from '../../src/parse'

describe('parseCommand()', () => {
  let callback: any
  let logger: any

  beforeEach(() => {
    callback = jest.fn()
    logger = {
      error: jest.fn(),
      log: jest.fn()
    }
  })

  describe('without annotations given', () => {
    it('executes callback with params and options', () => {
      parseCommand(
        ['node', 'scriptname', '--foo=bar', '-a', 'abc', 'def'],
        undefined,
        undefined,
        logger
      )(callback)
      expect(callback).toHaveBeenCalledWith(
        { a: true, foo: 'bar' },
        'abc',
        'def'
      )
      expect(logger.log).not.toHaveBeenCalled()
    })

    it('prints info that there is no documentation', () => {
      parseCommand(
        ['node', 'scriptname', '--help'],
        undefined,
        undefined,
        logger
      )(callback)
      expect(logger.log.mock.calls).toEqual([['Documentation not found']])
    })
  })

  describe('with string annotation given', () => {
    const annotation: any = 'General script description'

    it('prints basic help', () => {
      parseCommand(
        ['node', 'path/scriptname', '--help'],
        annotation,
        undefined,
        logger
      )(callback)
      expect(logger.log.mock.calls).toEqual([
        ['Usage: scriptname  \n'],
        ['General script description\n']
      ])
    })

    it('executes callback with params and options', () => {
      parseCommand(
        ['node', 'scriptname', '--foo=bar', '-a', 'abc', 'def'],
        annotation,
        undefined,
        logger
      )(callback)
      expect(callback).toHaveBeenCalledWith(
        { a: true, foo: 'bar' },
        'abc',
        'def'
      )
      expect(logger.log).not.toHaveBeenCalled()
    })
  })

  describe('with annotations given', () => {
    let annotations: any

    beforeEach(() => {
      annotations = {
        description: 'General script description',
        options: {
          a: 'description for a option',
          foo: 'description for foo option'
        },
        params: ['abc', 'def']
      }
    })

    it('executes callback with params and options', () => {
      parseCommand(
        ['node', 'scriptname', '--foo=bar', '-a', 'abc', 'def'],
        annotations,
        undefined,
        logger
      )(callback)
      expect(callback).toHaveBeenCalledWith(
        { a: true, foo: 'bar' },
        'abc',
        'def'
      )
      expect(logger.log).not.toHaveBeenCalled()
    })

    it('prints basic help', () => {
      parseCommand(
        ['node', 'path/scriptname', '--help'],
        annotations,
        undefined,
        logger
      )(callback)
      expect(logger.log.mock.calls).toEqual([
        ['Usage: scriptname [options] [abc def]\n'],
        ['General script description\n'],
        ['Options:\n'],
        ['  -a          description for a option'],
        ['  --foo       description for foo option']
      ])
    })

    it('throws error if option name is incorrect', () => {
      const cliScript = parseCommand(
        ['node', 'path/scriptname', '--abc'],
        annotations,
        undefined,
        logger
      )
      expect(() => {
        cliScript(callback)
      }).toThrow(
        'Illegal option: --abc\nAvailable options: -a --foo\nType "scriptname --help" for more information'
      )
      expect(callback).not.toHaveBeenCalled()
    })

    describe('and custom annotation', () => {
      beforeEach(() => {
        annotations.examples = 'examples content'
      })

      it('prints help with custom annotation', () => {
        parseCommand(
          ['node', 'path/scriptname', '--help'],
          annotations,
          undefined,
          logger
        )(callback)
        expect(logger.log.mock.calls).toEqual([
          ['Usage: scriptname [options] [abc def]\n'],
          ['General script description\n'],
          ['Options:\n'],
          ['  -a          description for a option'],
          ['  --foo       description for foo option'],
          ['\nExamples:\n'],
          ['examples content\n']
        ])
      })

      describe('with help formatting function', () => {
        let help: any

        beforeEach(() => {
          help = jest.fn()
        })

        it('executes callback with params and options', () => {
          parseCommand(
            ['node', 'scriptname', '--foo=bar', '-a', 'abc', 'def'],
            annotations,
            help,
            logger
          )(callback)
          expect(callback).toHaveBeenCalledWith(
            { a: true, foo: 'bar' },
            'abc',
            'def'
          )
          expect(logger.log).not.toHaveBeenCalled()
        })

        it('calls provided help function to handle annotations', () => {
          parseCommand(
            ['node', 'scriptname', '--help'],
            annotations,
            help,
            logger
          )(callback)
          expect(help).toHaveBeenCalledWith('scriptname', annotations, logger)
          expect(help).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})

describe('parseAllCommands()', () => {
  let obj: any
  let a: any
  let c: any
  let e: any
  let h: any
  beforeEach(() => {
    a = jest.fn()
    c = jest.fn()
    e = jest.fn()
    h = jest.fn()
    obj = {
      a,
      b: {
        c,
        d: {
          e
        }
      },
      'f:g:h': h
    }
  })

  it('calls the method from a given object by given method name and its arguments', () => {
    parseAllCommands(obj, ['node', 'task', 'a'])
    expect(a).toHaveBeenLastCalledWith({})
    parseAllCommands(obj, ['node', 'task', 'a', '1', '2'])
    expect(a).toHaveBeenLastCalledWith({}, '1', '2')
  })

  it('should handle dash arguments', () => {
    let calls: any = {}

    function fn(...args: any[]) {
      calls.args = args.slice(1)
      calls.options = args[0]
    }

    obj.a = fn

    parseAllCommands(obj, ['node', 'task', 'a', '-a', 'hello'])
    expect(calls).toEqual({ args: ['hello'], options: { a: true } })
    calls = {}
    parseAllCommands(obj, ['node', 'task', 'a', 'hello', '-a'])
    expect(calls).toEqual({ args: ['hello'], options: { a: true } })
    parseAllCommands(obj, ['node', 'task', 'a', '--abc', 'hello'])
    expect(calls).toEqual({ args: ['hello'], options: { abc: true } })
    parseAllCommands(obj, ['node', 'task', 'a', '-a=123', 'hello'])
    expect(calls).toEqual({ args: ['hello'], options: { a: 123 } })
    parseAllCommands(obj, ['node', 'task', 'a', '--abc=test', 'hello'])
    expect(calls).toEqual({ args: ['hello'], options: { abc: 'test' } })
    parseAllCommands(obj, ['node', 'task', 'a', '-a', '--abc=test', 'hello'])
    expect(calls).toEqual({
      args: ['hello'],
      options: { a: true, abc: 'test' }
    })
    parseAllCommands(obj, [
      'node',
      'task',
      'a',
      '-a',
      '--abc=test',
      '-b=4',
      'hello',
      '-abc',
      '--def'
    ])
    expect(calls).toEqual({
      args: ['hello', '-abc'],
      options: { a: true, b: 4, abc: 'test', def: true }
    })
    parseAllCommands(obj, [
      'node',
      'task',
      'a',
      '--ab-cd',
      '--ef-gh=test',
      '--ab.cd',
      '--ef.gh=123',
      'hello',
      '-abc'
    ])
    expect(calls).toEqual({
      args: ['hello', '-abc'],
      options: { 'ab-cd': true, 'ef-gh': 'test', 'ab.cd': true, 'ef.gh': 123 }
    })
    parseAllCommands(obj, [
      'node',
      'task',
      'a',
      '--host=http://www.google.com/',
      'hello'
    ])
    expect(calls).toEqual({
      args: ['hello'],
      options: { host: 'http://www.google.com/' }
    })
  })

  it('should handle dash arguments in nested tasks', () => {
    let calls: any = {}

    function fn(...args: any[]) {
      calls.args = args.slice(1)
      calls.options = args[0]
    }

    obj.b.c = fn

    parseAllCommands(obj, ['node', 'task', 'b:c', '-a', 'hello'])
    expect(calls).toEqual({ args: ['hello'], options: { a: true } })
    calls = {}
    parseAllCommands(obj, ['node', 'task', 'b:c', 'hello', '-a'])
    expect(calls).toEqual({ args: ['hello'], options: { a: true } })
  })

  it('should call methods from nested objects by method name name-spacing', () => {
    parseAllCommands(obj, ['node', 'task', 'a', '1', '2'])
    expect(a).toHaveBeenLastCalledWith({}, '1', '2')
    parseAllCommands(obj, ['node', 'task', 'b:c', '1', '2'])
    expect(c).toHaveBeenLastCalledWith({}, '1', '2')
    parseAllCommands(obj, ['node', 'task', 'b:d:e', '1', '2'])
    expect(e).toHaveBeenLastCalledWith({}, '1', '2')
    parseAllCommands(obj, ['node', 'task', 'f:g:h', '1', '2'])
    expect(h).toHaveBeenLastCalledWith({}, '1', '2')
  })

  it('should raise an error if called method cannot be found', () => {
    expect(() => {
      parseAllCommands(obj, ['node', 'task', 'abc'])
    }).toThrowError('Command abc not found')

    expect(() => {
      parseAllCommands(obj, ['node', 'task', 'abc'])
    }).toThrowError(CLICommandNotFound)

    expect(() => {
      parseAllCommands(obj, ['node', 'task', 'b:d'])
    }).toThrowError('Command b:d not found')
  })
})
