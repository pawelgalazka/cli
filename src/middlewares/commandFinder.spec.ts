import { CLIError } from '../index'
import { commandFinder } from './commandFinder'

describe('commandFinder()', () => {
  let definition: any
  let next: jest.Mock
  let args: any

  describe('when definition object given', () => {
    beforeEach(() => {
      next = jest.fn()
      args = {
        command: () => null,
        definition: {
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
        },
        namespace: '',
        options: {},
        params: []
      }
    })

    describe('with no namespace in task name', () => {
      it('calls command', () => {
        commandFinder(next)({ ...args, params: ['a'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.a,
          namespace: 'a',
          params: []
        })
      })

      it('calls default command', () => {
        commandFinder(next)(args)
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.default,
          namespace: '',
          params: []
        })
      })

      it('calls command with params', () => {
        commandFinder(next)({ ...args, params: ['a', 'arg1', 'arg2'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.a,
          namespace: 'a',
          params: ['arg1', 'arg2']
        })
      })

      it('calls default command with params', () => {
        commandFinder(next)({ ...args, params: ['arg1', 'arg2'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.default,
          namespace: '',
          params: ['arg1', 'arg2']
        })
      })

      it('calls command with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        commandFinder(next)({ ...args, options, params: ['a'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.a,
          namespace: 'a',
          options
        })
      })

      it('calls default command with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        commandFinder(next)({ ...args, options, params: [] })

        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.default,
          namespace: '',
          options
        })
      })

      it('throws error if no default command and command not found', () => {
        delete args.definition.default
        expect(() => {
          commandFinder(next)({ ...args, params: ['arg1', 'arg2'] })
        }).toThrow(CLIError)
      })
    })

    describe('with namespace in task name', () => {
      it('calls command from name space', () => {
        commandFinder(next)({ options: {}, params: ['b:c'], definition })
        expect(definition.b.c).toHaveBeenCalledTimes(1)
        expect(definition.b.c).toHaveBeenCalledWith({})
      })

      it('calls default command from name space', () => {
        commandFinder(next)({ options: {}, params: ['b'], definition })
        expect(definition.b.default).toHaveBeenCalledTimes(1)
        expect(definition.b.default).toHaveBeenCalledWith({})
      })

      it('calls command from name space with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        commandFinder(next)({
          definition,
          options,
          params: ['b:c']
        })
        expect(definition.b.c).toHaveBeenCalledTimes(1)
        expect(definition.b.c).toHaveBeenCalledWith(options)
      })

      it('calls default command from name space with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        commandFinder(next)({
          definition,
          options,
          params: ['b']
        })
        expect(definition.b.default).toHaveBeenCalledTimes(1)
        expect(definition.b.default).toHaveBeenCalledWith(options)
      })

      it('throws error if no default command and command from name space not found', () => {
        expect(() => {
          commandFinder(next)({
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
      commandFinder(next)({ options: {}, params: [], definition })
      expect(definition).toHaveBeenCalledTimes(1)
      expect(definition).toHaveBeenCalledWith({})
    })

    it('calls command with params', () => {
      commandFinder(next)({ options: {}, params: ['a', 'b'], definition })
      expect(definition).toHaveBeenCalledTimes(1)
      expect(definition).toHaveBeenCalledWith({}, 'a', 'b')
    })

    it('calls command with options', () => {
      const options = { op1: 'o1', op2: 'o2' }
      commandFinder(next)({ options, params: [], definition })
      expect(definition).toHaveBeenCalledTimes(1)
      expect(definition).toHaveBeenCalledWith(options)
    })
  })
})
