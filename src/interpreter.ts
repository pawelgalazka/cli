import { CLICommandNotFound } from './errors'
import { IAnnoations } from './help'

export interface ICLIOptions {
  [key: string]: number | string | boolean
}

export type CLIParams = string[]

export interface ICommandFunction {
  (...args: any[]): any
  help?: string | IAnnoations
}

export interface ICommandsTree {
  [key: string]: ICommandsTree | ICommandFunction | undefined
  default?: ICommandFunction
}

export interface IInterpreterArguments {
  options: ICLIOptions
  params: CLIParams
  commands: ICommandsTree | ICommandFunction
  namespace?: string
}

function helper(opts: any): any {
  return 1
}
export function interpret({
  options,
  params,
  commands,
  namespace
}: IInterpreterArguments): any {
  if (typeof commands === 'function') {
    const command = commands
    if (options.help) {
      return helper({ command, namespace })
    } else {
      // validate({ command, options, params, namespace})
      return command(options, ...params)
    }
  }

  if (commands) {
    const namespace = params[0]
    const nextParams = params.slice(1)
    const nextCommands = commands[namespace]

    if (nextCommands) {
      return interpret({
        commands: nextCommands,
        namespace,
        options,
        params: nextParams
      })
    }
    if (commands.default) {
      return interpret({
        commands: commands.default,
        options,
        params: nextParams
      })
    }
  }

  throw new CLICommandNotFound()
}
