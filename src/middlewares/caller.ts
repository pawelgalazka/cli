import { get } from 'lodash'
import { CLICommandNotFound } from '../errors'
import { CommandsModule, Middleware } from '../interpreter'

export const caller: Middleware = next => ({
  options,
  params,
  commandsModule
}) => {
  if (typeof commandsModule === 'function') {
    commandsModule(options, ...params)
    return next({ options, params, commandsModule })
  }

  const commandName = (params[0] || '').replace(/:/g, '.')
  const nextParams = params.slice(1)

  const command: CommandsModule | undefined = get(commandsModule, commandName)

  if (typeof command === 'function') {
    command(options, ...nextParams)
    return next({ options, params, commandsModule })
  }

  if (typeof command === 'object') {
    const defaultCommand = command.default

    if (typeof defaultCommand === 'function') {
      defaultCommand(options, ...nextParams)
      return next({ options, params, commandsModule })
    }
  }

  if (typeof command === 'undefined') {
    const defaultCommand = commandsModule.default

    if (typeof defaultCommand === 'function') {
      defaultCommand(options, ...params)
      return next({ options, params, commandsModule })
    }
  }

  throw new CLICommandNotFound()
}
