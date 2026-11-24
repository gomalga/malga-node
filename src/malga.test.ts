import { server, request } from 'tests'

import { Malga } from './malga'

describe('Malga', () => {
  test('should create a charge by performing each of the steps separately', async () => {
    server.use(
      request.post('https://api.malga.io/v1/customers', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000006',
            createdAt: '2023-09-20T18:30:22.344Z',
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
          }),
        )
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000046' }),
        )
      }),
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000047',
            status: 'active',
            createdAt: '2023-12-26T03:00:00.000Z',
            clientId: '00000000-0000-4000-8000-000000000003',
            customerId: null,
            brand: 'Mastercard',
            cardHolderName: 'Homer Simpson',
            cvvChecked: true,
            fingerprint: '/cddsad2sgTXxfNhdsadasdas2QSLsJ/dsadsadcxc=',
            first6digits: '511848',
            last4digits: '2250',
            expirationMonth: '03',
            expirationYear: '2024',
          }),
        )
      }),
      request.post('https://api.malga.io/v1/charges', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000017',
            clientId: 'CLIENT_ID',
            merchantId: '00000000-0000-4000-8000-000000000048',
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
              paymentType: 'credit',
              installments: 12,
            },
            paymentSource: {
              sourceType: 'card',
              cardId: '00000000-0000-4000-8000-000000000047',
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
          }),
        )
      }),
    )

    const malga = new Malga({ apiKey: 'API_KEY', clientId: 'CLIENT_ID' })

    const customer = await malga.customers.create({
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
    })

    const tokenization = await malga.cards.tokenization({
      holderName: 'Homer Simpson',
      number: '5175292227256170',
      expirationDate: '05/2025',
      cvv: '893',
    })

    const card = await malga.cards.create({
      tokenId: tokenization.tokenId,
      zeroDollar: {
        cvvCheck: true,
        merchantId: '00000000-0000-4000-8000-000000000049',
      },
    })

    const charge = await malga.charges.create({
      merchantId: '00000000-0000-4000-8000-000000000048',
      customerId: customer.id,
      amount: 100,
      paymentMethod: {
        type: 'credit',
        installments: 12,
        cardId: card.id,
      },
    })

    expect(charge).toMatchObject({
      id: '00000000-0000-4000-8000-000000000017',
      clientId: 'CLIENT_ID',
      merchantId: '00000000-0000-4000-8000-000000000048',
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
        paymentType: 'credit',
        installments: 12,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000047',
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
    })
  })

  test('should create a charge in a simplified manner', async () => {
    server.use(
      request.post('https://api.malga.io/v1/customers', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000006',
            createdAt: '2023-09-20T18:30:22.344Z',
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
          }),
        )
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000046' }),
        )
      }),
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000047',
            status: 'active',
            createdAt: '2023-12-26T03:00:00.000Z',
            clientId: '00000000-0000-4000-8000-000000000003',
            customerId: null,
            brand: 'Mastercard',
            cardHolderName: 'Homer Simpson',
            cvvChecked: true,
            fingerprint: '/cddsad2sgTXxfNhdsadasdas2QSLsJ/dsadsadcxc=',
            first6digits: '511848',
            last4digits: '2250',
            expirationMonth: '03',
            expirationYear: '2024',
          }),
        )
      }),
      request.post('https://api.malga.io/v1/charges', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000017',
            clientId: 'CLIENT_ID',
            merchantId: '00000000-0000-4000-8000-000000000048',
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
              paymentType: 'credit',
              installments: 12,
            },
            paymentSource: {
              sourceType: 'card',
              cardId: '00000000-0000-4000-8000-000000000047',
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
          }),
        )
      }),
    )

    const malga = new Malga({ apiKey: 'API_KEY', clientId: 'CLIENT_ID' })

    const charge = await malga.charges.create({
      merchantId: '00000000-0000-4000-8000-000000000048',
      amount: 100,
      customer: {
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
      },
      paymentMethod: {
        type: 'credit',
        installments: 12,
        card: {
          holderName: 'Homer Simpson',
          number: '5175292227256170',
          expirationDate: '05/2025',
          cvv: '893',
          zeroDollar: {
            cvvCheck: true,
            merchantId: '00000000-0000-4000-8000-000000000049',
          },
        },
      },
    })

    expect(charge).toMatchObject({
      id: '00000000-0000-4000-8000-000000000017',
      clientId: 'CLIENT_ID',
      merchantId: '00000000-0000-4000-8000-000000000048',
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
        paymentType: 'credit',
        installments: 12,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000047',
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
    })
  })

  test('should create a charge with a session', async () => {
    server.use(
      request.post('https://api.malga.io/v1/customers', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000006',
            createdAt: '2023-09-20T18:30:22.344Z',
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
          }),
        )
      }),
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ tokenId: '00000000-0000-4000-8000-000000000046' }),
        )
      }),
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '00000000-0000-4000-8000-000000000047',
            status: 'active',
            createdAt: '2023-12-26T03:00:00.000Z',
            clientId: '00000000-0000-4000-8000-000000000003',
            customerId: null,
            brand: 'Mastercard',
            cardHolderName: 'Homer Simpson',
            cvvChecked: true,
            fingerprint: '/cddsad2sgTXxfNhdsadasdas2QSLsJ/dsadsadcxc=',
            first6digits: '511848',
            last4digits: '2250',
            expirationMonth: '03',
            expirationYear: '2024',
          }),
        )
      }),
      request.post('https://api.malga.io/v1/sessions', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            createdAt: '2023-12-26T03:00:00.000Z',
            updatedAt: '2023-12-26T03:00:00.000Z',
            id: '00000000-0000-4000-8000-000000000006',
            publicKey: '00000000-0000-4000-8000-000000000050',
            status: 'created',
            paymentLink: '',
            name: 'Payment Link',
            amount: 100,
            merchantId: '00000000-0000-4000-8000-000000000048',
            dueDate: '2023-12-27T03:00:00.000Z',
            capture: true,
            createLink: false,
            currency: 'BRL',
            description: 'Session description',
            isActive: true,
            orderId: '00000000-0000-4000-8000-000000000051',
            statementDescriptor: 'Malga',
            paymentMethods: [
              { paymentType: 'credit', installments: 1 },
              { paymentType: 'pix', expiresIn: 60 },
            ],
            items: [{ name: 'Product 1', quantity: 1, unitPrice: 100 }],
          }),
        )
      }),
      request.post(
        'https://api.malga.io/v1/sessions/00000000-0000-4000-8000-000000000006/charge',
        (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: '00000000-0000-4000-8000-000000000017',
              clientId: 'CLIENT_ID',
              merchantId: '00000000-0000-4000-8000-000000000048',
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
                paymentType: 'credit',
                installments: 12,
              },
              paymentSource: {
                sourceType: 'card',
                cardId: '00000000-0000-4000-8000-000000000047',
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
            }),
          )
        },
      ),
    )

    const malga = new Malga({ apiKey: 'API_KEY', clientId: 'CLIENT_ID' })

    const session = await malga.sessions.create({
      name: 'Payment Link',
      amount: 100,
      merchantId: '00000000-0000-4000-8000-000000000048',
      dueDate: '2023-12-27T03:00:00.000Z',
      capture: false,
      createLink: false,
      currency: 'BRL',
      isActive: true,
      orderId: '00000000-0000-4000-8000-000000000051',
      paymentMethods: [
        { paymentType: 'credit', installments: 1 },
        { paymentType: 'pix', expiresIn: 60 },
      ],
      items: [{ name: 'Product 1', quantity: 1, unitPrice: 100 }],
    })

    const charge = await malga.charges.create({
      publicKey: session.publicKey,
      sessionId: session.id,
      customer: {
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
      },
      paymentMethod: {
        type: 'credit',
        installments: 12,
        card: {
          holderName: 'Homer Simpson',
          number: '5175292227256170',
          expirationDate: '05/2025',
          cvv: '893',
          zeroDollar: {
            cvvCheck: true,
            merchantId: '00000000-0000-4000-8000-000000000049',
          },
        },
      },
    })

    expect(charge).toMatchObject({
      id: '00000000-0000-4000-8000-000000000017',
      clientId: 'CLIENT_ID',
      merchantId: '00000000-0000-4000-8000-000000000048',
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
        paymentType: 'credit',
        installments: 12,
      },
      paymentSource: {
        sourceType: 'card',
        cardId: '00000000-0000-4000-8000-000000000047',
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
    })
  })
})
