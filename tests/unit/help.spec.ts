/* tslint:disable:no-empty */
import chalk from 'chalk'

import { printAllHelp } from '../../src/help'

describe('printAllHelp()', () => {
  let obj: any
  let logger: any
  let mockLogger: any

  beforeEach(() => {
    obj = {
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
      title: (...args: any[]) => {
        mockLogger('title', ...args)
      },
      warning: (...args: any[]) => {
        mockLogger('warning', ...args)
      }
    }
  })

  it('should log list of methods', () => {
    printAllHelp(obj, logger)
    expect(mockLogger.mock.calls).toEqual([
      ['log', chalk.bold('a')],
      ['log', chalk.bold('b')]
    ])
  })

  it('should log method descriptions', () => {
    obj.b = (arg1: any, arg2: any) => {}
    obj.a.help = 'Description for method a'
    obj.b.help = 'Description for method b'
    printAllHelp(obj, logger)
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
    obj.a.help = 'Description for method a\nsecond line\nthird line'
    obj.b.help = 'Description for method b'
    printAllHelp(obj, logger)
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
    obj.c = {
      d: () => {},
      e: {
        f: () => {},
        g: () => {}
      }
    }

    obj.c.help = 'Description for namespace c'
    obj.c.e.f.help = 'Description for method f'

    printAllHelp(obj, logger)
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
