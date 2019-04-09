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
  let middlewareCalls: number[]

  beforeEach(() => {
    middlewareCalls = []
    middleware1Thunk = jest.fn()
    middleware2Thunk = jest.fn()
    middleware3Thunk = jest.fn()
    middleware1 = jest.fn<MiddlewareThunk, [MiddlewareThunk]>(next => args => {
      middlewareCalls.push(1)
      middleware1Thunk(args)
      next(args)
    })
    middleware2 = jest.fn<MiddlewareThunk, [MiddlewareThunk]>(next => args => {
      middlewareCalls.push(2)
      middleware2Thunk(args)
      next(args)
    })
    middleware3 = jest.fn<MiddlewareThunk, [MiddlewareThunk]>(next => args => {
      middlewareCalls.push(3)
      middleware3Thunk(args)
      next(args)
    })
    options = { a: 1, b: 2 }
    params = ['p1', 'p2']
    middlewares = [middleware1, middleware2, middleware3]
    commandsModule = {}
    interpret({ options, params, commandsModule, middlewares })
  })

  it('executes each middleware function from the chain', () => {
    expect(middleware1).toHaveBeenCalledTimes(1)
    expect(middleware2).toHaveBeenCalledTimes(1)
    expect(middleware3).toHaveBeenCalledTimes(1)
  })

  it('executes each middleware thunk function from the chain', () => {
    expect(middleware1Thunk).toHaveBeenCalledTimes(1)
    expect(middleware2Thunk).toHaveBeenCalledTimes(1)
    expect(middleware3Thunk).toHaveBeenCalledTimes(1)
  })

  it('executes middleware thunks in the right order', () => {
    expect(middlewareCalls).toEqual([1, 2, 3])
  })
})
