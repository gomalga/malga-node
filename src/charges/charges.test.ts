import { server, request } from 'tests'
import { Api } from 'src/common/api'

import { Charges } from './charges'
import { Customers } from 'src/customers'
import { Cards } from 'src/cards'

const api = new Api({ apiKey: 'API_KEY', clientId: 'CLIENT_ID' })
const customers = new Customers(api)
const cards = new Cards(api)

describe('Charges', () => {
  test('should succeed in creating a charge', async () => {
    const chargeResponse = {
      id: '00000000-0000-4000-8000-000000000017',
      clientId: 'CLIENT_ID',
      merchantId: '00000000-0000-4000-8000-000000000018',
      description: null,
      orderId: null,
      createdAt: '2023-09-27T18:27:02.017Z',
      amount: 100,
      originalAmount: 100,
      currency: 'BRL',
      statementDescriptor: null,
      capture: false,
      isDispute: false,
      status: 'pre_authorized',
      paymentMethod: {
        installments: 1,
        paymentType: 'credit',
      },
      paymentSource: {
        sourceType: 'token',
        tokenId: '00000000-0000-4000-8000-000000000019',
      },
      transactionRequests: [
        {
          id: '00000000-0000-4000-8000-000000000020',
          createdAt: '2023-09-27T18:27:02.077Z',
          updatedAt: '2023-09-27T18:27:02.212Z',
          idempotencyKey: '00000000-0000-4000-8000-000000000021',
          providerId: '00000000-0000-4000-8000-000000000022',
          providerType: 'SANDBOX',
          transactionId: '00000000-0000-4000-8000-000000000023',
          amount: 100,
          authorizationCode: '9023792',
          authorizationNsu: '0210428',
          requestStatus: 'success',
          requestType: 'pre_authorization',
          responseTs: '41ms',
          providerAuthorization: {
            networkAuthorizationCode: '9490770',
            networkResponseCode: '3767930',
          },
        },
      ],
      appInfo: {
        platform: {
          name: 'SDK Node.js',
          version: '0.0.1',
          integrator: 'Malga',
        },
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/charges', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(chargeResponse))
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
    )

    const charges = new Charges(api, cards, customers)
    const response = await charges.create({
      merchantId: '00000000-0000-4000-8000-000000000018',
      amount: 100,
      paymentMethod: {
        type: 'credit',
        installments: 1,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
        },
      },
    })

    expect(response).toMatchObject(chargeResponse)
  })

  test('should generate an error when trying to create the charge', async () => {
    const error = {
      error: {
        type: 'bad_request',
        code: 400,
        message: 'Bad Request Exception',
        details: [
          'merchantId must be a UUID',
          'merchantId should not be empty',
          'merchantId must be a string',
        ],
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/charges', (_, res, ctx) => {
        return res(ctx.status(400), ctx.json(error))
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000024' }),
        )
      }),
    )

    const charges = new Charges(api, cards, customers)

    try {
      await charges.create({
        merchantId: '00000000-0000-4000-8000-000000000011',
        amount: 100,
        paymentMethod: {
          type: 'credit',
          installments: 1,
          card: {
            holderName: 'Homer Simpson',
            number: '5401177501978548',
            cvv: '192',
            expirationDate: '10/2024',
          },
        },
      })
    } catch (err) {
      expect(err).toMatchObject(error)
    }
  })

  test('should succeed in creating a charge with session', async () => {
    const sessionId = '00000000-0000-4000-8000-000000000025'
    const publicKey = '00000000-0000-4000-8000-000000000016'

    const chargeResponse = {
      id: '00000000-0000-4000-8000-000000000017',
      clientId: 'CLIENT_ID',
      merchantId: '00000000-0000-4000-8000-000000000018',
      description: null,
      orderId: null,
      createdAt: '2023-09-27T18:27:02.017Z',
      amount: 100,
      originalAmount: 100,
      currency: 'BRL',
      statementDescriptor: null,
      capture: false,
      isDispute: false,
      status: 'pre_authorized',
      paymentMethod: {
        installments: 1,
        paymentType: 'credit',
      },
      paymentSource: {
        sourceType: 'token',
        tokenId: '00000000-0000-4000-8000-000000000019',
      },
      transactionRequests: [
        {
          id: '00000000-0000-4000-8000-000000000020',
          createdAt: '2023-09-27T18:27:02.077Z',
          updatedAt: '2023-09-27T18:27:02.212Z',
          idempotencyKey: '00000000-0000-4000-8000-000000000021',
          providerId: '00000000-0000-4000-8000-000000000022',
          providerType: 'SANDBOX',
          transactionId: '00000000-0000-4000-8000-000000000023',
          amount: 100,
          authorizationCode: '9023792',
          authorizationNsu: '0210428',
          requestStatus: 'success',
          requestType: 'pre_authorization',
          responseTs: '41ms',
          providerAuthorization: {
            networkAuthorizationCode: '9490770',
            networkResponseCode: '3767930',
          },
        },
      ],
      appInfo: {
        platform: {
          name: 'SDK Node.js',
          version: '0.0.1',
          integrator: 'Malga',
        },
      },
    }

    server.use(
      request.post(
        `https://api.malga.io/v1/sessions/${sessionId}/charge`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(chargeResponse))
        },
      ),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000019' }),
        )
      }),
    )

    const charges = new Charges(api, cards, customers)
    const response = await charges.create({
      sessionId,
      publicKey,
      paymentMethod: {
        type: 'credit',
        installments: 1,
        card: {
          holderName: 'Homer Simpson',
          number: '5401177501978548',
          cvv: '192',
          expirationDate: '10/2024',
        },
      },
    })

    expect(response).toMatchObject(chargeResponse)
  })

  test('should generate an error when trying to create the charge with session', async () => {
    const sessionId = '00000000-0000-4000-8000-000000000025'
    const publicKey = '00000000-0000-4000-8000-000000000016'

    server.use(
      request.post(
        `https://api.malga.io/v1/sessions/${sessionId}/charge`,
        (_, res, ctx) => {
          return res(ctx.status(500))
        },
      ),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000024' }),
        )
      }),
    )
    const charges = new Charges(api, cards, customers)

    try {
      await charges.create({
        sessionId,
        publicKey,
        paymentMethod: {
          type: 'credit',
          installments: 1,
          card: {
            holderName: 'Homer Simpson',
            number: '5401177501978548',
            cvv: '192',
            expirationDate: '10/2024',
          },
        },
      })
    } catch (err) {
      expect(err).toMatchObject({
        error: {
          type: 'api_error',
          code: 500,
          message: 'unexpected error',
        },
      })
    }
  })

  test('should succeed when find for a charge by ID', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000026'
    const chargeResponse = {
      id: '00000000-0000-4000-8000-000000000026',
      clientId: '00000000-0000-4000-8000-000000000027',
      merchantId: '00000000-0000-4000-8000-000000000018',
      description: null,
      orderId: null,
      createdAt: '2023-09-22T12:05:15.995Z',
      amount: 100,
      originalAmount: 100,
      currency: 'BRL',
      statementDescriptor: null,
      capture: true,
      isDispute: false,
      status: 'authorized',
      paymentMethod: {
        installments: 1,
        paymentType: 'credit',
      },
      sourceType: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000028',
      },
      transactionRequests: [
        {
          id: '00000000-0000-4000-8000-000000000029',
          createdAt: '2023-09-22T12:05:16.011Z',
          updatedAt: '2023-09-22T12:05:16.038Z',
          idempotencyKey: '00000000-0000-4000-8000-000000000030',
          providerId: '00000000-0000-4000-8000-000000000031',
          providerType: 'SANDBOX',
          transactionId: '3864701',
          amount: 991,
          authorizationCode: '5426331',
          authorizationNsu: '4573722',
          requestStatus: 'success',
          requestType: 'authorization',
          responseTs: '12ms',
          providerAuthorization: {
            networkAuthorizationCode: '5502158',
            networkResponseCode: '4804827',
          },
        },
      ],
      appInfo: {
        platform: {
          name: 'SDK Node.js',
          version: '0.0.1',
          integrator: 'Malga',
        },
      },
    }

    server.use(
      request.get(
        `https://api.malga.io/v1/charges/${chargeId}`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(chargeResponse))
        },
      ),
    )

    const charges = new Charges(api, cards, customers)
    const response = await charges.find(chargeId)

    expect(response).toMatchObject(chargeResponse)
  })

  test('should generate an error when find for a non-existent charge', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000006'

    const error = {
      error: {
        type: 'entity_not_found',
        code: 404,
        message: 'unexpected error',
      },
    }

    server.use(
      request.get(
        `https://api.malga.io/v1/charges/${chargeId}`,
        (_, res, ctx) => {
          return res(ctx.status(404), ctx.json(error))
        },
      ),
    )

    const charges = new Charges(api, cards, customers)

    try {
      await charges.find(chargeId)
    } catch (err) {
      expect(err).toMatchObject(error)
    }
  })

  test('should succeed in listing the charges', async () => {
    const chargeList = {
      items: [
        {
          id: '00000000-0000-4000-8000-000000000026',
          clientId: '00000000-0000-4000-8000-000000000027',
          merchantId: '00000000-0000-4000-8000-000000000018',
          description: null,
          orderId: '00000000-0000-4000-8000-000000000032',
          createdAt: '2023-09-22T12:05:15.995Z',
          amount: 100,
          originalAmount: 100,
          currency: 'BRL',
          statementDescriptor: null,
          capture: true,
          isDispute: false,
          status: 'authorized',
          paymentMethod: {
            installments: 1,
            paymentType: 'credit',
          },
          sourceType: {
            sourceType: 'card',
            cardId: '00000000-0000-4000-8000-000000000028',
          },
          transactionRequests: [
            {
              id: '00000000-0000-4000-8000-000000000029',
              createdAt: '2023-09-22T12:05:16.011Z',
              updatedAt: '2023-09-22T12:05:16.038Z',
              idempotencyKey: '00000000-0000-4000-8000-000000000030',
              providerId: '00000000-0000-4000-8000-000000000031',
              providerType: 'SANDBOX',
              transactionId: '3864701',
              amount: 991,
              authorizationCode: '5426331',
              authorizationNsu: '4573722',
              requestStatus: 'success',
              requestType: 'authorization',
              responseTs: '12ms',
              providerAuthorization: {
                networkAuthorizationCode: '5502158',
                networkResponseCode: '4804827',
              },
            },
          ],
          appInfo: {
            platform: {
              name: 'SDK Node.js',
              version: '0.0.1',
              integrator: 'MALGA',
            },
          },
        },
      ],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 15,
        totalPages: 1,
        currentPage: 1,
      },
    }

    server.use(
      request.get('https://api.malga.io/v1/charges', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(chargeList))
      }),
    )

    const charges = new Charges(api, cards, customers)
    const response = await charges.list({
      limit: 15,
      page: 1,
      status: ['authorized'],
      amount: 991,
      hasSplit: false,
      merchantId: '00000000-0000-4000-8000-000000000018',
      orderId: '00000000-0000-4000-8000-000000000032',
      paymentMethod: ['credit'],
      provider: ['SANDBOX'],
      sort: 'DESC',
      startDate: '2023-12-26T03:00:00.000Z',
      endDate: '2023-12-27T03:00:00.000Z',
    })

    expect(response).toMatchObject(chargeList)
  })

  test('should generate an error when listing the charges', async () => {
    server.use(
      request.get('https://api.malga.io/v1/charges', (_, res, ctx) => {
        return res(ctx.status(500))
      }),
    )

    const charges = new Charges(api, cards, customers)

    try {
      await charges.list({
        limit: 15,
        page: 1,
        startDate: '2023-09-17T03:00:00.000Z',
        endDate: '2023-09-23T02:59:59.999Z',
      })
    } catch (err) {
      expect(err).toMatchObject({
        error: {
          type: 'api_error',
          code: 500,
          message: 'unexpected error',
        },
      })
    }
  })

  test('should succeed in capturing a charge', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000026'

    const chargeResponse = {
      id: chargeId,
      clientId: '00000000-0000-4000-8000-000000000027',
      merchantId: '00000000-0000-4000-8000-000000000018',
      description: null,
      orderId: '00000000-0000-4000-8000-000000000032',
      createdAt: '2023-09-22T12:05:15.995Z',
      amount: 100,
      originalAmount: 100,
      currency: 'BRL',
      statementDescriptor: null,
      capture: true,
      isDispute: false,
      status: 'authorized',
      paymentMethod: {
        installments: 1,
        paymentType: 'credit',
      },
      sourceType: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000028',
      },
      transactionRequests: [
        {
          id: '00000000-0000-4000-8000-000000000029',
          createdAt: '2023-09-22T12:05:16.011Z',
          updatedAt: '2023-09-22T12:05:16.038Z',
          idempotencyKey: '00000000-0000-4000-8000-000000000030',
          providerId: '00000000-0000-4000-8000-000000000031',
          providerType: 'SANDBOX',
          transactionId: '3864701',
          amount: 991,
          authorizationCode: '5426331',
          authorizationNsu: '4573722',
          requestStatus: 'success',
          requestType: 'authorization',
          responseTs: '12ms',
          providerAuthorization: {
            networkAuthorizationCode: '5502158',
            networkResponseCode: '4804827',
          },
        },
      ],
      appInfo: {
        platform: {
          name: 'SDK Node.js',
          version: '0.0.1',
          integrator: 'Malga',
        },
      },
    }

    server.use(
      request.post(
        `https://api.malga.io/v1/charges/${chargeId}/capture`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(chargeResponse))
        },
      ),
    )

    const charges = new Charges(api, cards, customers)
    const response = await charges.capture(chargeId, {
      amount: 100,
    })

    expect(response).toMatchObject(chargeResponse)
  })

  test('should result in an error when capturing a charge', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000026'

    server.use(
      request.post(
        `https://api.malga.io/v1/charges/${chargeId}/capture`,
        (_, res, ctx) => {
          return res(ctx.status(500))
        },
      ),
    )

    const charges = new Charges(api, cards, customers)

    try {
      await charges.capture(chargeId, {
        amount: 100,
      })
    } catch (err) {
      expect(err).toMatchObject({
        error: {
          type: 'api_error',
          code: 500,
          message: 'unexpected error',
        },
      })
    }
  })

  test('should succeed in refunding a charge', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000026'

    const chargeResponse = {
      id: chargeId,
      clientId: '00000000-0000-4000-8000-000000000027',
      merchantId: '00000000-0000-4000-8000-000000000018',
      description: null,
      orderId: '00000000-0000-4000-8000-000000000032',
      createdAt: '2023-09-22T12:05:15.995Z',
      amount: 100,
      originalAmount: 100,
      currency: 'BRL',
      statementDescriptor: null,
      capture: true,
      isDispute: false,
      status: 'authorized',
      paymentMethod: {
        installments: 1,
        paymentType: 'credit',
      },
      sourceType: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000028',
      },
      transactionRequests: [
        {
          id: '00000000-0000-4000-8000-000000000029',
          createdAt: '2023-09-22T12:05:16.011Z',
          updatedAt: '2023-09-22T12:05:16.038Z',
          idempotencyKey: '00000000-0000-4000-8000-000000000030',
          providerId: '00000000-0000-4000-8000-000000000031',
          providerType: 'SANDBOX',
          transactionId: '3864701',
          amount: 991,
          authorizationCode: '5426331',
          authorizationNsu: '4573722',
          requestStatus: 'success',
          requestType: 'authorization',
          responseTs: '12ms',
          providerAuthorization: {
            networkAuthorizationCode: '5502158',
            networkResponseCode: '4804827',
          },
        },
      ],
      appInfo: {
        platform: {
          name: 'SDK Node.js',
          version: '0.0.1',
          integrator: 'Malga',
        },
      },
    }

    server.use(
      request.post(
        `https://api.malga.io/v1/charges/${chargeId}/void`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(chargeResponse))
        },
      ),
    )

    const charges = new Charges(api, cards, customers)
    const response = await charges.refund(chargeId, {
      amount: 100,
    })

    expect(response).toMatchObject(chargeResponse)
  })

  test('should result in an error when refunding a charge', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000026'

    server.use(
      request.post(
        `https://api.malga.io/v1/charges/${chargeId}/void`,
        (_, res, ctx) => {
          return res(ctx.status(500))
        },
      ),
    )

    const charges = new Charges(api, cards, customers)

    try {
      await charges.refund(chargeId, {
        amount: 100,
      })
    } catch (err) {
      expect(err).toMatchObject({
        error: {
          type: 'api_error',
          code: 500,
          message: 'unexpected error',
        },
      })
    }
  })
})
