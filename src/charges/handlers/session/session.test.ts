import { SessionHandler } from './session'

describe('SessionHandler', () => {
  test('should succeed in parsing the session', () => {
    const sessionHandler = new SessionHandler()
    const payload = sessionHandler.handle({
      sessionId: '00000000-0000-4000-8000-000000000040',
      publicKey: '00000000-0000-4000-8000-000000000016',
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'pix',
        expiresIn: 60,
      },
    })

    expect(payload).toMatchObject({
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'pix',
        expiresIn: 60,
      },
    })
  })

  test('should pass to the next handler because is not session', () => {
    const sessionHandler = new SessionHandler()
    const payload = sessionHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'drip',
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'drip',
      },
    })
  })
})
