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

    describe('about params and options without descriptions', () => {
      beforeEach(() => {
        annotations = {
          params: ['abc', 'def'],
          options: ['a', 'foo']
        }
      })

      it('executes callback with params and options', () => {
        microcli(['scriptname', '--foo=bar', '-a', 'abc', 'def'], annotations, null, logger)(callback)
        expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
        expect(logger.log).not.toHaveBeenCalled()
      })
    })

    describe('about params and options with descriptions', () => {
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

      describe('and other extra', () => {
        beforeEach(() => {
          annotations['description'] = 'script description'
          annotations['examples'] = 'examples content'
        })

        it('executes callback with params and options', () => {
          microcli(['scriptname', '--foo=bar', '-a', 'abc', 'def'], annotations, null, logger)(callback)
          expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
          expect(logger.log).not.toHaveBeenCalled()
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
