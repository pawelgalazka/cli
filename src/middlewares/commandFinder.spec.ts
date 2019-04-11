import { CLIError } from '../index'
import { commandFinder } from './commandFinder'

describe('commandFinder()', () => {
  let next: jest.Mock
  let args: any

  beforeEach(() => {
    next = jest.fn()
    args = {
      command: () => null,
      definition: null,
      namespace: '',
      options: {},
      params: []
    }
  })

  describe('when definition object given', () => {
    beforeEach(() => {
      args.definition = {
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
        }).toThrow(new CLIError('Command not found'))
      })
    })

    describe('with namespace in task name', () => {
      it('calls command from name space', () => {
        commandFinder(next)({ ...args, params: ['b:c'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.b.c,
          namespace: 'b:c'
        })
      })

      it('calls default command from name space', () => {
        commandFinder(next)({ ...args, params: ['b'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.b.default,
          namespace: 'b'
        })
      })

      it('calls command from name space with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        commandFinder(next)({ ...args, options, params: ['b:c'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.b.c,
          namespace: 'b:c',
          options
        })
      })

      it('calls default command from name space with options', () => {
        const options = { op1: 'o1', op2: 'o2' }
        commandFinder(next)({ ...args, options, params: ['b'] })
        expect(next).toHaveBeenCalledWith({
          ...args,
          command: args.definition.b.default,
          namespace: 'b',
          options
        })
      })

      it('throws error if no default command and command from name space not found', () => {
        expect(() => {
          commandFinder(next)({ ...args, params: ['f', 'arg1', 'arg2'] })
        }).toThrow(new CLIError('Command not found'))
      })
    })
  })

  describe('when function as definition given', () => {
    beforeEach(() => {
      args.definition = jest.fn()
    })

    it('calls command', () => {
      commandFinder(next)(args)
      expect(next).toHaveBeenCalledWith({
        ...args,
        command: args.definition
      })
    })

    it('calls command with params', () => {
      commandFinder(next)({ ...args, params: ['a', 'b'] })
      expect(next).toHaveBeenCalledWith({
        ...args,
        command: args.definition,
        params: ['a', 'b']
      })
    })

    it('calls command with options', () => {
      const options = { op1: 'o1', op2: 'o2' }
      commandFinder(next)({ ...args, options })
      expect(next).toHaveBeenCalledWith({
        ...args,
        command: args.definition,
        options
      })
    })
  })
})
