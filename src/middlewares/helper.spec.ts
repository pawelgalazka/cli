/* tslint:disable:no-empty */
import chalk from 'chalk'

import { help, helper } from './helper'

describe('printHelp()', () => {
  let logger: any
  let mockLogger: any
  let args: any
  let next: jest.Mock

  beforeEach(() => {
    next = jest.fn()
    args = {
      command: null,
      definition: {
        a: () => {},
        b: () => {}
      },
      namespace: '',
      options: { help: true },
      params: []
    }

    mockLogger = jest.fn()
    logger = {
      error: (...args: any[]) => {
        mockLogger('error', ...args)
      },
      log: (...args: any[]) => {
        mockLogger('log', ...args)
      },
      warn: (...args: any[]) => {
        mockLogger('warning', ...args)
      }
    }
  })

  describe('when definition as object with commands given', () => {
    it('should log list of methods', () => {
      helper(logger)(next)(args)
      expect(mockLogger.mock.calls).toEqual([
        ['log', chalk.bold('a')],
        ['log', chalk.bold('b')]
      ])
    })

    it('should log method descriptions', () => {
      args.definition.b = (arg1: any, arg2: any) => {}
      help(args.definition.a, 'Description for method a')
      help(args.definition.b, 'Description for method b')
      helper(logger)(next)(args)
      expect(mockLogger.mock.calls).toEqual([
        [
          'log',
          chalk.bold('a') + '                              ',
          '-',
          'Description for method a'
        ],
        [
          'log',
          chalk.bold('b') + '                              ',
          '-',
          'Description for method b'
        ]
      ])
    })

    it('should log only first line of method descriptions', () => {
      help(
        args.definition.a,
        'Description for method a\nsecond line\nthird line'
      )
      help(args.definition.b, 'Description for method b')
      helper(logger)(next)(args)
      expect(mockLogger.mock.calls).toEqual([
        [
          'log',
          chalk.bold('a') + '                              ',
          '-',
          'Description for method a'
        ],
        [
          'log',
          chalk.bold('b') + '                              ',
          '-',
          'Description for method b'
        ]
      ])
    })

    it('should log list of name spaced / nested methods', () => {
      args.definition.c = {
        d: () => {},
        e: {
          f: () => {},
          g: () => {}
        }
      }

      help(args.definition.c.e.f, 'Description for method f')

      helper(logger)(next)(args)
      expect(mockLogger.mock.calls).toEqual([
        ['log', chalk.bold('a')],
        ['log', chalk.bold('b')],
        ['log', chalk.bold('c:d')],
        [
          'log',
          chalk.bold('c:e:f') + '                          ',
          '-',
          'Description for method f'
        ],
        ['log', chalk.bold('c:e:g')]
      ])
    })
  })
})
