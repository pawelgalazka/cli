import { annotationsMap, help } from './helper'
import { validator } from './validator'

describe('validator()', () => {
  let args: any
  let next: jest.Mock

  beforeEach(() => {
    annotationsMap.clear()
    next = jest.fn()
    args = {
      command: () => null,
      definition: {
        a: () => null,
        b: () => null
      },
      namespace: '',
      options: {},
      params: []
    }
  })

  describe('when detailed annotations provided', () => {
    beforeEach(() => {
      help(args.command, {
        description: 'General script description',
        options: {
          a: 'description for a option',
          foo: 'description for foo option'
        },
        params: ['abc', 'def']
      })
    })

    it('calls next middleware if provided valid options', () => {
      validator(next)(args)
      expect(next).toHaveBeenCalledWith(args)
      args.options = { a: 1 }
      validator(next)(args)
      expect(next).toHaveBeenCalledWith(args)
    })

    it('throws error if invalid option provided', () => {
      args.options = { abc: 1 }
      expect(() => {
        validator(next)(args)
      }).toThrowErrorMatchingSnapshot()
    })

    it('does not call the next middleware if error thrown', () => {
      args.options = { abc: 1 }
      expect(() => {
        validator(next)(args)
      }).toThrow()
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('when string as annotation provided', () => {
    beforeEach(() => {
      help(args.command, 'General script description')
    })

    it('calls next middleware', () => {
      validator(next)(args)
      expect(next).toHaveBeenCalledWith(args)
    })
  })

  describe('when annotation not provided', () => {
    it('calls next middleware', () => {
      validator(next)(args)
      expect(next).toHaveBeenCalledWith(args)
    })
  })
})
