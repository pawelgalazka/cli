/* tslint:disable:no-empty */
import chalk from 'chalk'

import { printHelp } from '../../src/helper'

describe('printHelp()', () => {
  let module: any
  let logger: any
  let mockLogger: any
  let namespace: string

  beforeEach(() => {
    // namespace = 'script.js'
    module = {
      a: () => {},
      b: () => {}
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

  describe('when node of commands given', () => {
    it('should log list of methods', () => {
      printHelp({ module, logger, namespace })
      expect(mockLogger.mock.calls).toEqual([
        ['log', chalk.bold('a')],
        ['log', chalk.bold('b')]
      ])
    })

    it('should log method descriptions', () => {
      module.b = (arg1: any, arg2: any) => {}
      module.a.help = 'Description for method a'
      module.b.help = 'Description for method b'
      printHelp({ module, logger, namespace })
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
      module.a.help = 'Description for method a\nsecond line\nthird line'
      module.b.help = 'Description for method b'
      printHelp({ module, logger, namespace })
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
      module.c = {
        d: () => {},
        e: {
          f: () => {},
          g: () => {}
        }
      }

      module.c.help = 'Description for namespace c'
      module.c.e.f.help = 'Description for method f'

      printHelp({ module, logger, namespace })
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
