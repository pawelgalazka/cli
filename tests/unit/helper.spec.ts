/* tslint:disable:no-empty */
import chalk from 'chalk'

import { printHelp } from '../../src/helper'

describe('printHelp()', () => {
  let node: any
  let logger: any
  let mockLogger: any
  let namespace: string

  beforeEach(() => {
    // namespace = 'script.js'
    node = {
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
      printHelp({ node, logger, namespace })
      expect(mockLogger.mock.calls).toEqual([
        ['log', chalk.bold('a')],
        ['log', chalk.bold('b')]
      ])
    })

    it('should log method descriptions', () => {
      node.b = (arg1: any, arg2: any) => {}
      node.a.help = 'Description for method a'
      node.b.help = 'Description for method b'
      printHelp({ node, logger, namespace })
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
      node.a.help = 'Description for method a\nsecond line\nthird line'
      node.b.help = 'Description for method b'
      printHelp({ node, logger, namespace })
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
      node.c = {
        d: () => {},
        e: {
          f: () => {},
          g: () => {}
        }
      }

      node.c.help = 'Description for namespace c'
      node.c.e.f.help = 'Description for method f'

      printHelp({ node, logger, namespace })
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
