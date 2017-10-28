/* eslint-env jest */
const microcli = require('../index')

describe('microcli', () => {
  let callback, logger

  beforeEach(() => {
    callback = jest.fn()
    logger = {
      log: jest.fn()
    }
  })

  describe('without annotations given', () => {
    it('executes callback with params and options', () => {
      microcli(['node', 'scriptname', '--foo=bar', '-a', 'abc', 'def'], null, null, logger)(callback)
      expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
      expect(logger.log).not.toHaveBeenCalled()
    })

    it('prints no help', () => {
      microcli(['node', 'scriptname', '--help'], null, null, logger)(callback)
      expect(logger.log).not.toHaveBeenCalled()
    })
  })

  describe('with annotations given', () => {
    let annotations

    beforeEach(() => {
      annotations = {
        description: 'General script description',
        params: ['abc', 'def'],
        options: {
          a: 'description for a option',
          foo: 'description for foo option'
        }
      }
    })

    it('executes callback with params and options', () => {
      microcli(['node', 'scriptname', '--foo=bar', '-a', 'abc', 'def'], annotations, null, logger)(callback)
      expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
      expect(logger.log).not.toHaveBeenCalled()
    })

    it('prints basic help', () => {
      microcli(['node', 'path/scriptname', '--help'], annotations, null, logger)(callback)
      expect(logger.log.mock.calls).toEqual([
        ['Usage: scriptname [options] [abc def]\n'],
        ['General script description\n'],
        ['Options:\n'],
        ['  -a          description for a option'],
        ['  --foo       description for foo option']
      ])
    })

    it('throws error if option name is incorrect', () => {
      expect(() => {
        microcli(['node', 'path/scriptname', '--abc'], annotations, null, logger)
      }).toThrow('Illegal option: --abc\nAvailable options: -a --foo\nType "scriptname --help" for more information')
      expect(callback).not.toHaveBeenCalled()
    })

    describe('and other extra', () => {
      beforeEach(() => {
        annotations['examples'] = 'examples content'
      })

      it('prints help with extra annotation', () => {
        microcli(['node', 'path/scriptname', '--help'], annotations, null, logger)(callback)
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
        let help

        beforeEach(() => {
          help = jest.fn()
        })

        it('executes callback with params and options', () => {
          microcli(['node', 'scriptname', '--foo=bar', '-a', 'abc', 'def'], annotations, help, logger)(callback)
          expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
          expect(logger.log).not.toHaveBeenCalled()
        })

        it('calls provided help function to handle annotations', () => {
          microcli(['node', 'scriptname', '--help'], annotations, help, logger)(callback)
          expect(help).toHaveBeenCalledWith('scriptname', annotations, logger)
          expect(help).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
