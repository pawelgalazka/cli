import { cli } from '../src/index'

describe('cli', () => {
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
      cli(
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
      cli(['node', 'scriptname', '--help'], undefined, undefined, logger)(
        callback
      )
      expect(logger.log.mock.calls).toEqual([['Documentation not found']])
    })
  })

  describe('with string annotation given', () => {
    const annotation: any = 'General script description'

    it('prints basic help', () => {
      cli(['node', 'path/scriptname', '--help'], annotation, undefined, logger)(
        callback
      )
      expect(logger.log.mock.calls).toEqual([
        ['Usage: scriptname  \n'],
        ['General script description\n']
      ])
    })

    it('executes callback with params and options', () => {
      cli(
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
      cli(
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
      cli(
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
      const cliScript = cli(
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
        cli(
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
          cli(
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
          cli(['node', 'scriptname', '--help'], annotations, help, logger)(
            callback
          )
          expect(help).toHaveBeenCalledWith('scriptname', annotations, logger)
          expect(help).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
