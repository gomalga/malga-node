import { server, request } from 'tests'

import { Api } from 'src/common/api'
import { Cards } from 'src/cards'

import { CreditHandler } from './credit'
import { Customers } from 'src/customers'

const api = new Api({ apiKey: 'API_KEY', clientId: 'CLIENT_ID' })
const cards = new Cards(api)
const customers = new Customers(api)

describe('CreditHandler', () => {
  test('should succeed in parsing the credit data with tokenId', async () => {
    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        tokenId: '00000000-0000-4000-8000-000000000019',
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'token',
        tokenId: '00000000-0000-4000-8000-000000000019',
      },
    })
  })

  test('should succeed in parsing the credit data with cardId', async () => {
    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        cardId: '00000000-0000-4000-8000-000000000019',
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000019',
      },
    })
  })

  test('should succeed in parsing the credit data with cardId and cvv', async () => {
    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        cardId: '00000000-0000-4000-8000-000000000019',
        cardCvv: '170',
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000019',
        cardCvv: '170',
      },
    })
  })

  test('should succeed in parsing the credit data with cardId and tokenCvv', async () => {
    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        cardId: '00000000-0000-4000-8000-000000000019',
        tokenCvv: '00000000-0000-4000-8000-000000000014',
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000019',
        tokenCvv: '00000000-0000-4000-8000-000000000014',
      },
    })
  })

  test('should succeed in parsing the credit data with the customer oneshot', async () => {
    const customer = {
      name: 'Homer Simpson',
      email: 'homer@simpsons.com',
      phoneNumber: '99999999999',
      document: {
        type: 'cpf',
        number: '99999999999',
        country: 'BR',
      },
      address: {
        street: 'Evergreen Terrace',
        streetNumber: '742',
        zipCode: '62629',
        country: 'US',
        state: 'Louisiana',
        city: 'Springfield',
        district: 'Suburb',
        complement: 'Residence',
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/customers', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...customer,
            id: '00000000-0000-4000-8000-000000000012',
            createdAt: '2023-12-26T03:00:00.000Z',
          }),
        )
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
    )

    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customer,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
        },
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'token',
        tokenId: '00000000-0000-4000-8000-000000000019',
      },
    })
  })

  test('should succeed in parsing the credit data with the customer oneshot and full tokenization', async () => {
    const customer = {
      name: 'Homer Simpson',
      email: 'homer@simpsons.com',
      phoneNumber: '99999999999',
      document: {
        type: 'cpf',
        number: '99999999999',
        country: 'BR',
      },
      address: {
        street: 'Evergreen Terrace',
        streetNumber: '742',
        zipCode: '62629',
        country: 'US',
        state: 'Louisiana',
        city: 'Springfield',
        district: 'Suburb',
        complement: 'Residence',
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/customers', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...customer,
            id: '00000000-0000-4000-8000-000000000012',
            createdAt: '2023-12-26T03:00:00.000Z',
          }),
        )
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ id: '00000000-0000-4000-8000-000000000038' }),
        )
      }),
    )

    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customer,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
          zeroDollar: {
            cvvCheck: true,
            merchantId: '00000000-0000-4000-8000-000000000039',
          },
        },
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000038',
      },
    })
  })

  test('should succeed in parsing the credit data with the customer oneshot, full tokenization and link card to customer', async () => {
    const customer = {
      name: 'Homer Simpson',
      email: 'homer@simpsons.com',
      phoneNumber: '99999999999',
      document: {
        type: 'cpf',
        number: '99999999999',
        country: 'BR',
      },
      address: {
        street: 'Evergreen Terrace',
        streetNumber: '742',
        zipCode: '62629',
        country: 'US',
        state: 'Louisiana',
        city: 'Springfield',
        district: 'Suburb',
        complement: 'Residence',
      },
    }

    const customerId = '00000000-0000-4000-8000-000000000012'

    server.use(
      request.post('https://api.malga.io/v1/customers', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...customer,
            id: customerId,
            createdAt: '2023-12-26T03:00:00.000Z',
          }),
        )
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ id: '00000000-0000-4000-8000-000000000038' }),
        )
      }),
      request.post(
        `https://api.malga.io/v1/customer/${customerId}/cards`,
        (_, res, ctx) => {
          return res(ctx.status(200))
        },
      ),
    )

    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customer,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
          zeroDollar: {
            cvvCheck: true,
            merchantId: '00000000-0000-4000-8000-000000000039',
          },
        },
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      customerId,
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000038',
      },
    })
  })

  test('should succeed in parsing the credit data with the customerId', async () => {
    server.use(
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
    )

    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'credit',
        installments: 2,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
        },
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'token',
        tokenId: '00000000-0000-4000-8000-000000000019',
      },
    })
  })

  test('should succeed in parsing the credit data with the customerId and full tokenization', async () => {
    server.use(
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ id: '00000000-0000-4000-8000-000000000038' }),
        )
      }),
    )

    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customerId: '00000000-0000-4000-8000-000000000012',
      paymentMethod: {
        type: 'credit',
        installments: 2,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
          zeroDollar: {
            cvvCheck: true,
            merchantId: '00000000-0000-4000-8000-000000000039',
          },
        },
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000038',
      },
    })
  })

  test('should succeed in parsing the credit data with the customerId, full tokenization and link card to customer', async () => {
    const customerId = '00000000-0000-4000-8000-000000000012'

    server.use(
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ id: '00000000-0000-4000-8000-000000000038' }),
        )
      }),
      request.post(
        `https://api.malga.io/v1/customer/${customerId}/cards`,
        (_, res, ctx) => {
          return res(ctx.status(200))
        },
      ),
    )

    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
      merchantId: '00000000-0000-4000-8000-000000000037',
      amount: 100,
      customerId,
      paymentMethod: {
        type: 'credit',
        installments: 2,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
          zeroDollar: {
            cvvCheck: true,
            merchantId: '00000000-0000-4000-8000-000000000039',
          },
        },
      },
    })

    expect(payload).toMatchObject({
      merchantId: '00000000-0000-4000-8000-000000000037',
      customerId: '00000000-0000-4000-8000-000000000012',
      amount: 100,
      paymentMethod: {
        paymentType: 'credit',
        installments: 2,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000038',
      },
    })
  })

  test('should pass to the next handler because the payment method is not credit', async () => {
    const creditHandler = new CreditHandler(cards, customers)
    const payload = await creditHandler.handle({
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
