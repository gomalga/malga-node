import { Api } from 'src/common/api'
import { ChargeCreateBuilder } from './charge-create-builder'
import { Cards } from 'src/cards'
import { Customers } from 'src/customers'

const api = new Api({ apiKey: 'API_KEY', clientId: 'CLIENT_ID' })
const cards = new Cards(api)
const customers = new Customers(api)

describe('ChargeCreateBuilder', () => {
  test('should succeed in building the credit payload.', async () => {
    const chargeCreateBuilder = new ChargeCreateBuilder(cards, customers)
    const payload = await chargeCreateBuilder.payload({
      merchantId: '00000000-0000-4000-8000-000000000011',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        type: 'credit',
        installments: 1,
        cardId: '00000000-0000-4000-8000-000000000013',
        cardCvv: '170',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        paymentType: 'credit',
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000013',
        cardCvv: '170',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
    })
  })

  test('should succeed in building the voucher payload.', async () => {
    const chargeCreateBuilder = new ChargeCreateBuilder(cards, customers)
    const payload = await chargeCreateBuilder.payload({
      merchantId: '00000000-0000-4000-8000-000000000011',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        type: 'voucher',
        cardId: '00000000-0000-4000-8000-000000000013',
        tokenCvv: '00000000-0000-4000-8000-000000000014',
        items: [
          {
            id: '1',
            title: 'Product 1',
            quantity: 1,
            unitPrice: 100,
          },
        ],
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
      merchantId: '00000000-0000-4000-8000-000000000011',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        paymentType: 'voucher',
        items: [
          {
            id: '1',
            title: 'Product 1',
            quantity: 1,
            unitPrice: 100,
          },
        ],
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000013',
        tokenCvv: '00000000-0000-4000-8000-000000000014',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
    })
  })

  test('should succeed in building the PIX payload.', async () => {
    const chargeCreateBuilder = new ChargeCreateBuilder(cards, customers)
    const payload = await chargeCreateBuilder.payload({
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'pix',
        expiresIn: 60,
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      paymentMethod: {
        paymentType: 'pix',
        expiresIn: 60,
      },
      paymentSource: {
        sourceType: 'customer',
        customerId: '00000000-0000-4000-8000-000000000012',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
    })
  })

  test('should succeed in building the boleto payload.', async () => {
    const chargeCreateBuilder = new ChargeCreateBuilder(cards, customers)
    const payload = await chargeCreateBuilder.payload({
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'boleto',
        expiresDate: '2024-12-31',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      paymentMethod: {
        paymentType: 'boleto',
        expiresDate: '2024-12-31',
      },
      paymentSource: {
        sourceType: 'customer',
        customerId: '00000000-0000-4000-8000-000000000012',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
    })
  })

  test('should succeed in building the NuPay payload.', async () => {
    const chargeCreateBuilder = new ChargeCreateBuilder(cards, customers)
    const payload = await chargeCreateBuilder.payload({
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'nupay',
        delayToAutoCancel: 60,
        items: [
          {
            name: 'Product 1',
            quantity: 1,
            risk: 'Low',
            sku: '1',
            unitPrice: 100,
          },
        ],
      },
      fraudAnalysis: {
        sla: 99,
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
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      paymentMethod: {
        paymentType: 'nupay',
        delayToAutoCancel: 60,
      },
      paymentSource: {
        sourceType: 'customer',
        customerId: '00000000-0000-4000-8000-000000000012',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              name: 'Product 1',
              quantity: 1,
              risk: 'Low',
              sku: '1',
              unitPrice: 100,
            },
          ],
        },
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
    })
  })

  test('should succeed in building the Drip payload.', async () => {
    const chargeCreateBuilder = new ChargeCreateBuilder(cards, customers)
    const payload = await chargeCreateBuilder.payload({
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'drip',
        items: [
          {
            id: '1',
            title: 'Product 1',
            quantity: 1,
            unitPrice: 100,
          },
        ],
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              sku: '1',
              risk: 'Low',
              name: 'Product 1',
              quantity: 1,
              unitPrice: 100,
            },
          ],
        },
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
      merchantId: '00000000-0000-4000-8000-000000000011',
      amount: 100,
      paymentMethod: {
        paymentType: 'drip',
        items: [
          {
            id: '1',
            title: 'Product 1',
            quantity: 1,
            unitPrice: 100,
          },
        ],
      },
      paymentSource: {
        sourceType: 'customer',
        customerId: '00000000-0000-4000-8000-000000000012',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              sku: '1',
              risk: 'Low',
              name: 'Product 1',
              quantity: 1,
              unitPrice: 100,
            },
          ],
        },
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
    })
  })

  test('should succeed in building the session payload.', async () => {
    const chargeCreateBuilder = new ChargeCreateBuilder(cards, customers)
    const payload = await chargeCreateBuilder.payload({
      sessionId: '00000000-0000-4000-8000-000000000015',
      publicKey: '00000000-0000-4000-8000-000000000016',
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'pix',
        expiresIn: 60,
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              sku: '1',
              risk: 'Low',
              name: 'Product 1',
              quantity: 1,
              unitPrice: 100,
            },
          ],
        },
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
      paymentMethod: {
        paymentType: 'pix',
        expiresIn: 60,
      },
      paymentSource: {
        sourceType: 'customer',
        customerId: '00000000-0000-4000-8000-000000000012',
      },
      fraudAnalysis: {
        sla: 99,
        cart: {
          items: [
            {
              sku: '1',
              risk: 'Low',
              name: 'Product 1',
              quantity: 1,
              unitPrice: 100,
            },
          ],
        },
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
    })
  })
})
