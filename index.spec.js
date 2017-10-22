/* eslint-env jest */
const microcli = require('./index')

describe('microcli', () => {
  let callback

  beforeEach(() => {
    callback = jest.fn()
  })

  describe('without annotations given', () => {
    it('executes callback with params and options', () => {
      microcli(['scriptname', '--foo=bar', '-a', 'abc', 'def'])(callback)
      expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
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

      describe('and other extra', () => {
        beforeEach(() => {
          annotations['description'] = 'script description'
          annotations['examples'] = 'examples content'
        })

        describe('with help formatting function', () => {

        })
      })
    })
  })
})
