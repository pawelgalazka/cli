import { CLICommandNotFound } from '../utils/errors'
import { caller } from './caller'

describe('interpreter', () => {
  let definition: any
  let next: jest.Mock

  describe('when definition object given', () => {
    beforeEach(() => {
      next = jest.fn()
      definition = {
        a: jest.fn(),
        b: {
          c: jest.fn(),
          d: {
            e: jest.fn()
          },
          default: jest.fn()
        },
        default: jest.fn(),
        f: {}
      }
    })

    describe('with no namespace in task name', () => {
      it('calls command', () => {
        caller(next)({ options: {}, params: ['a'], definition })
        expect(definition.a).toHaveBeenCalledTimes(1)
        expect(definition.a).toHaveBeenCalledWith({})
      })

      it('calls default command', () => {
        caller(next)({ options: {}, params: [], definition })
        expect(definition.default).toHaveBeenCalledTimes(1)
        expect(definition.default).toHaveBeenCalledWith({})
      })

      it('calls command with params', () => {
        caller(next)({
          definition,
          options: {},
          params: ['a', 'arg1', 'arg2']
        })
        expect(definition.a).toHaveBeenCalledTimes(1)
        expect(definition.a).toHaveBeenCalledWith({}, 'arg1', 'arg2')
      })

      it('calls default command with params', () => {
        caller(next)({
          definition,
          options: {},
          params: ['arg1', 'arg2']
        })
        expect(definition.default).toHaveBeenCalledTimes(1)
        expect(definition.default).toHaveBeenCalledWith({}, 'arg1', 'arg2')
      })

      it('calls command with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        caller(next)({
          definition,
          options,
          params: ['a']
        })
        expect(definition.a).toHaveBeenCalledTimes(1)
        expect(definition.a).toHaveBeenCalledWith(options)
      })

      it('calls default command with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        caller(next)({
          definition,
          options,
          params: []
        })
        expect(definition.default).toHaveBeenCalledTimes(1)
        expect(definition.default).toHaveBeenCalledWith(options)
      })

      it('throws error if no default command and command not found', () => {
        delete definition.default
        expect(() => {
          caller(next)({
            definition,
            options: {},
            params: ['arg1', 'arg2']
          })
        }).toThrow(CLICommandNotFound)
      })
    })

    describe('with namespace in task name', () => {
      it('calls command from name space', () => {
        caller(next)({ options: {}, params: ['b:c'], definition })
        expect(definition.b.c).toHaveBeenCalledTimes(1)
        expect(definition.b.c).toHaveBeenCalledWith({})
      })

      it('calls default command from name space', () => {
        caller(next)({ options: {}, params: ['b'], definition })
        expect(definition.b.default).toHaveBeenCalledTimes(1)
        expect(definition.b.default).toHaveBeenCalledWith({})
      })

      it('calls command from name space with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        caller(next)({
          definition,
          options,
          params: ['b:c']
        })
        expect(definition.b.c).toHaveBeenCalledTimes(1)
        expect(definition.b.c).toHaveBeenCalledWith(options)
      })

      it('calls default command from name space with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        caller(next)({
          definition,
          options,
          params: ['b']
        })
        expect(definition.b.default).toHaveBeenCalledTimes(1)
        expect(definition.b.default).toHaveBeenCalledWith(options)
      })

      it('throws error if no default command and command from name space not found', () => {
        expect(() => {
          caller(next)({
            definition,
            options: {},
            params: ['f', 'arg1', 'arg2']
          })
        }).toThrow(CLICommandNotFound)
      })
    })
  })

  describe('when function as definition given', () => {
    beforeEach(() => {
      definition = jest.fn()
    })

    it('calls command', () => {
      caller(next)({ options: {}, params: [], definition })
      expect(definition).toHaveBeenCalledTimes(1)
      expect(definition).toHaveBeenCalledWith({})
    })

    it('calls command with params', () => {
      caller(next)({ options: {}, params: ['a', 'b'], definition })
      expect(definition).toHaveBeenCalledTimes(1)
      expect(definition).toHaveBeenCalledWith({}, 'a', 'b')
    })

    it('calls command with options', () => {
      const options = { op1: 'o1', op2: 'o2' }
      caller(next)({ options, params: [], definition })
      expect(definition).toHaveBeenCalledTimes(1)
      expect(definition).toHaveBeenCalledWith(options)
    })
  })
})
