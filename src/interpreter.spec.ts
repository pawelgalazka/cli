import {
  CLIParams,
  CommandsModule,
  ICLIOptions,
  interpret,
  Middleware,
  MiddlewareThunk
} from './interpreter'

describe('interpreter', () => {
  let middleware1: Middleware
  let middleware2: Middleware
  let middleware3: Middleware
  let middleware1Thunk: MiddlewareThunk
  let middleware2Thunk: MiddlewareThunk
  let middleware3Thunk: MiddlewareThunk
  let options: ICLIOptions
  let params: CLIParams
  let middlewares: Middleware[]
  let commandsModule: CommandsModule

  beforeEach(() => {
    middleware1Thunk = jest.fn()
    middleware2Thunk = jest.fn()
    middleware3Thunk = jest.fn()
    middleware1 = jest.fn().mockReturnValue(middleware1Thunk)
    middleware2 = jest.fn().mockReturnValue(middleware2Thunk)
    middleware3 = jest.fn().mockReturnValue(middleware3Thunk)
    options = { a: 1, b: 2 }
    params = ['p1', 'p2']
    middlewares = [middleware1, middleware2, middleware3]
    commandsModule = {}
  })

  it('executes each middleware function from the chain', () => {
    interpret({ options, params, commandsModule, middlewares })
    expect(middleware1).toHaveBeenCalledTimes(1)
    expect(middleware2).toHaveBeenCalledTimes(1)
    expect(middleware3).toHaveBeenCalledTimes(1)
  })
})
