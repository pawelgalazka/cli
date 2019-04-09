export interface ICLIOptions {
  [key: string]: number | string | boolean
}

export type CommandFunction = (options: ICLIOptions, ...args: any[]) => any

export interface ICommandsDictionary {
  [namespace: string]: CommandsModule
}

export interface IMiddlewareArguments {
  options: ICLIOptions
  params: CLIParams
  commandsModule: CommandsModule
}

export interface IInterpreterArguments extends IMiddlewareArguments {
  middlewares?: Middleware[]
}

export type CLIParams = string[]

export type CommandsModule = ICommandsDictionary | CommandFunction

export type MiddlewareThunk = (args: IMiddlewareArguments) => any
export type Middleware = (next: MiddlewareThunk) => MiddlewareThunk

export function interpret({
  options,
  params,
  commandsModule,
  middlewares = []
}: IInterpreterArguments): any {
  const middleware = middlewares.reduceRight(
    (nextMiddleware, previousMiddleware) => next =>
      previousMiddleware(nextMiddleware(next))
  )
  middleware(() => null)({ options, params, commandsModule })
}
