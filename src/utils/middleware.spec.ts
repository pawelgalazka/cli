import { middleware, Middleware, MiddlewareThunk } from './middleware'

interface IThunkArgs {
  a: number
  b: number
}

describe('middleware', () => {
  let middleware1: Middleware<IThunkArgs>
  let middleware2: Middleware<IThunkArgs>
  let middleware3: Middleware<IThunkArgs>
  let middleware1Thunk: MiddlewareThunk<IThunkArgs>
  let middleware2Thunk: MiddlewareThunk<IThunkArgs>
  let middleware3Thunk: MiddlewareThunk<IThunkArgs>
  let middlewareCalls: number[]
  let thunkArgs: IThunkArgs
  let middlewares: Array<Middleware<IThunkArgs>>

  beforeEach(() => {
    middlewareCalls = []
    thunkArgs = { a: 1, b: 2 }
    middleware1Thunk = jest.fn()
    middleware2Thunk = jest.fn()
    middleware3Thunk = jest.fn()
  })

  describe('when each middleware calls the next one', () => {
    beforeEach(() => {
      middleware1 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(1)
        middleware1Thunk(args)
        next(args)
      })
      middleware2 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(2)
        middleware2Thunk(args)
        next(args)
      })
      middleware3 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(3)
        middleware3Thunk(args)
        next(args)
      })

      middlewares = [middleware1, middleware2, middleware3]
      middleware<IThunkArgs>(middlewares)(thunkArgs)
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

    it('executes middleware thunks with proper arguments', () => {
      expect(middleware1Thunk).toHaveBeenCalledWith(thunkArgs)
      expect(middleware2Thunk).toHaveBeenCalledWith(thunkArgs)
      expect(middleware3Thunk).toHaveBeenCalledWith(thunkArgs)
    })
  })

  describe('when one of the middlewares thunk does not call the next one', () => {
    beforeEach(() => {
      middleware1 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(1)
        middleware1Thunk(args)
        next(args)
      })
      middleware2 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(2)
        middleware2Thunk(args)
      })
      middleware3 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(3)
        middleware3Thunk(args)
        next(args)
      })

      middlewares = [middleware1, middleware2, middleware3]
      middleware<IThunkArgs>(middlewares)(thunkArgs)
    })

    it('executes each middleware function from the chain', () => {
      expect(middleware1).toHaveBeenCalledTimes(1)
      expect(middleware2).toHaveBeenCalledTimes(1)
      expect(middleware3).toHaveBeenCalledTimes(1)
    })

    it('second middleware thunk does not call the last middleware thunk', () => {
      expect(middleware1Thunk).toHaveBeenCalledTimes(1)
      expect(middleware2Thunk).toHaveBeenCalledTimes(1)
      expect(middleware3Thunk).toHaveBeenCalledTimes(0)
    })

    it('executes middleware thunks in the right order', () => {
      expect(middlewareCalls).toEqual([1, 2])
    })
  })

  describe('when middlewares thunks calls next one with modified args', () => {
    let modifiedArgs: IThunkArgs

    beforeEach(() => {
      modifiedArgs = { a: 3, b: 4 }
      middleware1 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(1)
        middleware1Thunk(args)
        next(args)
      })
      middleware2 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(2)
        next(modifiedArgs)
        middleware2Thunk(args)
      })
      middleware3 = jest.fn<
        MiddlewareThunk<IThunkArgs>,
        [MiddlewareThunk<IThunkArgs>]
      >(next => args => {
        middlewareCalls.push(3)
        middleware3Thunk(args)
        next(args)
      })

      middlewares = [middleware1, middleware2, middleware3]
      middleware<IThunkArgs>(middlewares)(thunkArgs)
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

    it('executes third middleware thunk with changed arguments', () => {
      expect(middleware1Thunk).toHaveBeenCalledWith(thunkArgs)
      expect(middleware2Thunk).toHaveBeenCalledWith(thunkArgs)
      expect(middleware3Thunk).toHaveBeenCalledWith(modifiedArgs)
    })
  })
})
