/* tslint:disable:no-empty */
import chalk from 'chalk'

import { annotationsMap, help, helper, IHelpDetailedAnnoations } from './helper'

describe('helper()', () => {
  let logger: any
  let args: any
  let next: jest.Mock
  let argv: string[]

  beforeEach(() => {
    annotationsMap.clear()
    next = jest.fn()
    argv = ['./test/scriptName.js']
    args = {
      command: null,
      definition: {
        a: () => {},
        b: () => {}
      },
      namespace: '',
      options: {},
      params: []
    }

    logger = {
      log: jest.fn()
    }
  })

  describe('when help option not given', () => {
    it('calls the next middleware', () => {
      helper(logger, argv)(next)(args)
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(args)
    })

    it('does not call the logger', () => {
      helper(logger, argv)(next)(args)
      expect(logger.log).not.toHaveBeenCalled()
    })
  })

  describe('when help option given', () => {
    beforeEach(() => {
      args.options = { help: true }
    })

    describe('and command and namespace found', () => {
      beforeEach(() => {
        args.command = () => null
        args.namespace = 'commandName'
      })

      describe('without any annotation given', () => {
        it('does not call the next middleware', () => {
          helper(logger, argv)(next)(args)
          expect(next).not.toHaveBeenCalled()
        })

        it('logs info that there is no documentation', () => {
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([['Documentation not found']])
        })
      })

      describe('with string annotation given', () => {
        beforeEach(() => {
          help(args.command, 'General script description')
        })

        it('logs basic help', () => {
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([
            ['Usage: commandName  \n'],
            ['General script description\n']
          ])
        })
      })

      describe('with detailed annotations given', () => {
        let annotations: IHelpDetailedAnnoations
        beforeEach(() => {
          annotations = {
            description: 'General script description',
            options: {
              a: 'description for a option',
              foo: 'description for foo option'
            },
            params: ['abc', 'def']
          }
        })

        it('logs basic help', () => {
          help(args.command, annotations)
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([
            ['Usage: commandName [options] [abc def]\n'],
            ['General script description\n'],
            ['Options:\n'],
            ['  -a          description for a option'],
            ['  --foo       description for foo option']
          ])
        })

        it('logs custom section', () => {
          annotations.examples = 'examples content'
          help(args.command, annotations)
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([
            ['Usage: commandName [options] [abc def]\n'],
            ['General script description\n'],
            ['Options:\n'],
            ['  -a          description for a option'],
            ['  --foo       description for foo option'],
            ['\nExamples:\n'],
            ['examples content\n']
          ])
        })
      })
    })

    describe('and command not found and namespace is empty', () => {
      describe('without annotations for commands given', () => {
        it('does not call the next middleware', () => {
          helper(logger, argv)(next)(args)
          expect(next).not.toHaveBeenCalled()
        })

        it('logs list of methods', () => {
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([
            ['\nCommands:\n'],
            [chalk.bold('a')],
            [chalk.bold('b')]
          ])
        })
      })

      describe('with string annotations for commands given', () => {
        beforeEach(() => {
          help(args.definition.a, 'Description for method a')
          help(args.definition.b, 'Description for method b')
        })

        it('logs method descriptions', () => {
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([
            ['\nCommands:\n'],
            [
              chalk.bold('a') + '                              ',
              '-',
              'Description for method a'
            ],
            [
              chalk.bold('b') + '                              ',
              '-',
              'Description for method b'
            ]
          ])
        })

        it('logs only first line of method descriptions', () => {
          help(
            args.definition.a,
            'Description for method a\nsecond line\nthird line'
          )
          help(args.definition.b, 'Description for method b')
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([
            ['\nCommands:\n'],
            [
              chalk.bold('a') + '                              ',
              '-',
              'Description for method a'
            ],
            [
              chalk.bold('b') + '                              ',
              '-',
              'Description for method b'
            ]
          ])
        })
      })

      describe('with namespaced definition given', () => {
        beforeEach(() => {
          args.definition.c = {
            d: () => {},
            e: {
              f: () => {},
              g: () => {}
            }
          }
        })

        it('logs list of name spaced / nested methods', () => {
          help(args.definition.c.e.f, 'Description for method f')
          helper(logger, argv)(next)(args)
          expect(logger.log.mock.calls).toEqual([
            ['\nCommands:\n'],
            [chalk.bold('a')],
            [chalk.bold('b')],
            [chalk.bold('c:d')],
            [
              chalk.bold('c:e:f') + '                          ',
              '-',
              'Description for method f'
            ],
            [chalk.bold('c:e:g')]
          ])
        })
      })
    })
  })
})
