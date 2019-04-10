export type MiddlewareThunk<T> = (args: T) => any
export type Middleware<T> = (next: MiddlewareThunk<T>) => MiddlewareThunk<T>

export function middleware<T>(middlewares: Array<Middleware<T>>) {
  const middleware = middlewares.reduceRight(
    (nextMiddleware, previousMiddleware) => next =>
      previousMiddleware(nextMiddleware(next))
  )
  return middleware(() => null)
}
