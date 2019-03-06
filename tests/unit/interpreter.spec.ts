describe('interpreter', () => {
  let commandsModule: any
  describe('when commandsModule object given', () => {
    beforeEach(() => {
      commandsModule = {
        a: jest.fn(),
        b: {
          c: jest.fn(),
          d: {
            e: jest.fn()
          }
        },
        default: jest.fn()
      }
    })
  })

  describe('when function as commandsModule given', () => {
    beforeEach(() => {
      commandsModule = jest.fn()
    })
  })
})
