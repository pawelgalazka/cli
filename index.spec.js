/* eslint-env jest */
const microcli = require('./index')

describe('microcli', () => {
  let callback

  beforeEach(() => {
    callback = jest.fn()
  })

  it('executes callback with params and options', () => {
    microcli(['scriptname', '--foo=bar', '-a', 'abc', 'def'])(callback)
    expect(callback).toHaveBeenCalledWith({a: true, foo: 'bar'}, 'abc', 'def')
  })
})
