import { get } from 'lodash'

import { CommandsModule, Middleware } from '../index'

export const commandFinder: Middleware = next => args => {
  const { definition, params } = args
  if (typeof definition === 'function') {
    return next({
      ...args,
      command: definition
    })
  }

  const namespace = params[0] || ''
  const path = namespace.replace(/:/g, '.')
  const command: CommandsModule | undefined = get(definition, path)
  const nextParams = params.slice(1)

  if (typeof command === 'function') {
    return next({ ...args, command, namespace, params: nextParams })
  }

  if (typeof command === 'object') {
    const defaultCommand = command.default

    if (typeof defaultCommand === 'function') {
      return next({
        ...args,
        command: defaultCommand,
        namespace,
        params: nextParams
      })
    }
  }

  if (typeof command === 'undefined') {
    const defaultCommand = definition.default

    if (typeof defaultCommand === 'function') {
      return next({ ...args, command: defaultCommand })
    }
  }

  return next({
    ...args,
    command: undefined
  })
}
