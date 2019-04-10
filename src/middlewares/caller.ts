import { get } from 'lodash'
import {
  CLIParams,
  CommandFunction,
  CommandsModule,
  Middleware
} from '../interpreter'
import { CLICommandNotFound } from '../utils/errors'

export function findCommand(
  commandsModule: CommandsModule,
  params: CLIParams
): CommandFunction | undefined {
  if (typeof commandsModule === 'function') {
    return commandsModule
  }

  const commandName = (params[0] || '').replace(/:/g, '.')
  const command: CommandsModule | undefined = get(commandsModule, commandName)

  if (typeof command === 'function') {
    return command
  }

  if (typeof command === 'object') {
    const defaultCommand = command.default

    if (typeof defaultCommand === 'function') {
      return defaultCommand
    }
  }

  if (typeof command === 'undefined') {
    const defaultCommand = commandsModule.default

    if (typeof defaultCommand === 'function') {
      return defaultCommand
    }
  }

  return undefined
}

export function getCommandParams(
  commandsModule: CommandsModule,
  params: CLIParams
): CLIParams {
  if (typeof commandsModule === 'function') {
    return params.slice()
  }

  const commandName = (params[0] || '').replace(/:/g, '.')

  const command: CommandsModule | undefined = get(commandsModule, commandName)

  if (typeof command === 'undefined') {
    const defaultCommand = commandsModule.default

    if (typeof defaultCommand === 'function') {
      return params.slice()
    }
  }

  return params.slice(1)
}

export const caller: Middleware = next => ({
  options,
  params,
  commandsModule
}) => {
  const command = findCommand(commandsModule, params)
  const commandParams = getCommandParams(commandsModule, params)

  if (command) {
    command(options, ...commandParams)
    return next({ options, params, commandsModule })
  }

  throw new CLICommandNotFound()
}
