/* eslint-env jest */
const microcli = require('./index')

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
      microcli(['scriptname', '--foo=bar', '-a', 'abc', 'def'], null, null, logger)(callback)
      expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
      expect(logger.log).not.toHaveBeenCalled()
    })
  })

  describe('with annotations given', () => {
    let annotations

    describe('about params and options', () => {
      beforeEach(() => {
        annotations = {
          params: {
            abc: 'description for abc param',
            def: 'description for def param'
          },
          options: {
            a: 'description for a option',
            foo: 'description for foo option'
          }
        }
      })

      it('executes callback with params and options', () => {
        microcli(['scriptname', '--foo=bar', '-a', 'abc', 'def'], annotations, null, logger)(callback)
        expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
        expect(logger.log).not.toHaveBeenCalled()
      })

      it('throws error if option name is incorrect', () => {
        expect(() => {
          microcli(['scriptname', '--abc'], annotations, null, logger)(callback)
        }).toThrow('Illegal option: --abc\nAvailable options: -a --foo\nType "scriptname --help" for more information')
        expect(callback).not.toHaveBeenCalled()
      })

      describe('and other extra', () => {
        beforeEach(() => {
          annotations['description'] = 'script description'
          annotations['examples'] = 'examples content'
        })

        describe('with help formatting function', () => {
          let help

          beforeEach(() => {
            help = () => {}
          })
          it('executes callback with params and options', () => {
            microcli(['scriptname', '--foo=bar', '-a', 'abc', 'def'], annotations, help, logger)(callback)
            expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
            expect(logger.log).not.toHaveBeenCalled()
          })
        })
      })
    })
  })
})
