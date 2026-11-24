import { server, request } from 'tests'
import { Api } from 'src/common/api'

import { Cards } from './cards'

const api = new Api({ apiKey: 'API_KEY', clientId: 'CLIENT_ID' })

describe('Cards', () => {
  test('should succeed in creating a card', async () => {
    const cardResponse = {
      id: '00000000-0000-4000-8000-000000000002',
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
      statusReason: 'fingerprint',
    }

    server.use(
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(cardResponse))
      }),
    )

    const cards = new Cards(api)
    const response = await cards.create({
      tokenId: '00000000-0000-4000-8000-000000000004',
      zeroDollar: {
        cvvCheck: true,
        merchantId: '00000000-0000-4000-8000-000000000005',
      },
    })

    expect(response).toMatchObject(cardResponse)
  })

  test('should generate an error when trying to create the card', async () => {
    const error = {
      error: {
        type: 'bad_request',
        code: 400,
        message: 'Bad Request Exception',
        details: ['tokenId must be a UUID'],
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/cards', (_, res, ctx) => {
        return res(ctx.status(400), ctx.json(error))
      }),
    )

    const cards = new Cards(api)

    try {
      await cards.create({
        tokenId: '1234',
        zeroDollar: {
          cvvCheck: true,
          merchantId: '00000000-0000-4000-8000-000000000005',
        },
      })
    } catch (err) {
      expect(err).toMatchObject(error)
    }
  })

  test('should succeed when find for a card by ID', async () => {
    const cardId = '00000000-0000-4000-8000-000000000006'

    const cardResponse = {
      id: cardId,
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
    }

    server.use(
      request.get(`https://api.malga.io/v1/cards/${cardId}`, (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(cardResponse))
      }),
    )

    const cards = new Cards(api)
    const response = await cards.find(cardId)

    expect(response).toMatchObject(cardResponse)
  })

  test('should generate an error when find for a non-existent card', async () => {
    const cardId = '00000000-0000-4000-8000-000000000006'

    const error = {
      error: {
        type: 'invalid_request_error',
        code: 404,
        message: 'Resource not found',
      },
    }

    server.use(
      request.get(`https://api.malga.io/v1/cards/${cardId}`, (_, res, ctx) => {
        return res(ctx.status(404), ctx.json(error))
      }),
    )

    const cards = new Cards(api)

    try {
      await cards.find(cardId)
    } catch (err) {
      expect(err).toMatchObject(error)
    }
  })

  test('should succeed in listing the cards', async () => {
    const cardList = {
      items: [
        {
          id: '00000000-0000-4000-8000-000000000006',
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
      request.get(`https://api.malga.io/v1/cards`, (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(cardList))
      }),
    )

    const cards = new Cards(api)
    const response = await cards.list({
      limit: 15,
      page: 1,
    })

    expect(response).toMatchObject(cardList)
  })

  test('should generate an error when listing the card', async () => {
    server.use(
      request.get(`https://api.malga.io/v1/cards`, (_, res, ctx) => {
        return res(ctx.status(500))
      }),
    )

    const cards = new Cards(api)

    try {
      await cards.list({
        limit: 15,
        page: 1,
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

  test('should succeed in tokenizing a card', async () => {
    const tokenizationResponse = {
      tokenId: '00000000-0000-4000-8000-000000000007',
    }

    server.use(
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(tokenizationResponse))
      }),
    )

    const cards = new Cards(api)
    const response = await cards.tokenization({
      holderName: 'Homer Simpson',
      number: '5175292227256170',
      expirationDate: '05/2025',
      cvv: '893',
    })

    expect(response).toMatchObject(tokenizationResponse)
  })

  test('should result in an error when tokenizing a card', async () => {
    const responseError = {
      error: {
        type: 'card_declined',
        code: 400,
        declined_code: 'invalid_number',
        message: 'invalid card number',
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(ctx.status(400), ctx.json(responseError))
      }),
    )

    const cards = new Cards(api)

    try {
      await cards.tokenization({
        holderName: 'Homer Simpson',
        number: '5175292227256170123213123',
        expirationDate: '05/2025',
        cvv: '893',
      })
    } catch (err) {
      expect(err).toMatchObject({
        error: {
          type: 'card_declined',
          code: 400,
          declinedCode: 'invalid_number',
          message: 'invalid card number',
        },
      })
    }
  })

  test('should succeed in tokenizing a CVV', async () => {
    const tokenizationResponse = {
      tokenId: '00000000-0000-4000-8000-000000000007',
    }

    server.use(
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(tokenizationResponse))
      }),
    )

    const cards = new Cards(api)
    const response = await cards.tokenization({
      cvv: '893',
    })

    expect(response).toMatchObject(tokenizationResponse)
  })

  test('should successfully validate the CVV tokenization body', async () => {
    server.use(
      request.post('https://api.malga.io/v1/tokens', async (req, res, ctx) => {
        const body = await req.json()

        return res(
          ctx.status(200),
          ctx.json({ status: !!body.cvvUpdate ? 'ok' : 'error' }),
        )
      }),
    )

    const cards = new Cards(api)
    const response = await cards.tokenization({
      cvv: '893',
    })

    expect(response).toMatchObject({ status: 'ok' })
  })

  test('should result in an error when tokenizing a CVV', async () => {
    const responseError = {
      error: {
        type: 'card_declined',
        code: 400,
        declined_code: 'invalid_cvv_update',
        message: 'invalid card update',
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/tokens', (_, res, ctx) => {
        return res(ctx.status(400), ctx.json(responseError))
      }),
    )

    const cards = new Cards(api)

    try {
      await cards.tokenization({
        cvv: 'error',
      })
    } catch (err) {
      expect(err).toMatchObject({
        error: {
          type: 'card_declined',
          code: 400,
          declinedCode: 'invalid_cvv_update',
          message: 'invalid card update',
        },
      })
    }
  })
})
