import { version } from '../../../../package.json'

import { ChargeHandler } from './charge'

describe('ChargeHandler', () => {
  test('should succeed in parsing the threeDSecure', () => {
    const chargeHandler = new ChargeHandler()
    const payload = chargeHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000011',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        type: 'pix',
        expiresIn: 60,
      },
      threeDSecure: {
        browser: {
          acceptHeader: 'acceptHeader',
          colorDepth: 24,
          ip: '127.0.0.1',
          javaEnabled: true,
          javaScriptEnabled: true,
          language: 'pt-BR',
          screenHeight: 1080,
          screenWidth: 1920,
          timeZoneOffset: '0',
          userAgent: 'userAgent',
        },
        redirectURL: 'https://localhost:3000',
        requestorURL: 'https://localhost:3000',
      },
    })

    expect(payload).toMatchObject({
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'pix',
        expiresIn: 60,
      },
      threeDSecure2: {
        browser: {
          acceptHeader: 'acceptHeader',
          colorDepth: 24,
          ip: '127.0.0.1',
          javaEnabled: true,
          javaScriptEnabled: true,
          language: 'pt-BR',
          screenHeight: 1080,
          screenWidth: 1920,
          timeZoneOffset: '0',
          userAgent: 'userAgent',
        },
        redirectURL: 'https://localhost:3000',
        requestorURL: 'https://localhost:3000',
      },
      appInfo: {
        platform: {
          name: 'SDK Node.js',
          integrator: 'Malga',
          version,
        },
      },
    })
  })
})
