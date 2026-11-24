import { server, request } from 'tests'
import { Api } from 'src/common/api'

import { Sellers } from './sellers'
import { Seller } from './interfaces/sellers'

const api = new Api({
  apiKey: 'API_KEY',
  clientId: 'CLIENT_ID',
})

describe('Sellers', () => {
  test('should succeed in creating a seller', async () => {
    const seller: Seller = {
      merchantId: '00000000-0000-4000-8000-000000000009',
      owner: {
        name: 'Homer Simpson',
        email: 'homer@simpsons.com',
        phoneNumber: '99999999999',
        birthdate: '1989-12-17',
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
      mcc: 1,
      bankAccount: {
        holderName: 'Simpsons',
        holderDocument: '99999999999',
        bank: '077',
        branchNumber: '492',
        branchCheckDigit: '1',
        accountNumber: '4929',
        accountCheckDigit: '22',
        type: 'conta_corrente',
      },
      metadata: [
        {
          key: '768093',
          value: 'Additional information',
        },
      ],
      transferPolicy: {
        transferDay: 5,
        transferEnabled: true,
        transferInterval: 'weekly',
        automaticAnticipationEnabled: false,
      },
    }

    const newSeller = {
      id: '00000000-0000-4000-8000-000000000006',
      createdAt: '2023-09-20T18:30:22.344Z',
      ...seller,
    }

    server.use(
      request.post('https://api.malga.io/v1/sellers', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(newSeller))
      }),
    )

    const sellers = new Sellers(api)
    const response = await sellers.create(seller)

    expect(response).toMatchObject(newSeller)
  })

  test('should generate an error when trying to create the seller', async () => {
    const seller: Seller = {
      merchantId: '00000000-0000-4000-8000-000000000009',
      owner: {
        name: 'Homer Simpson',
        email: 'homer@simpsons',
        phoneNumber: '99999999999',
        birthdate: '1989-12-17',
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
      mcc: 1,
      bankAccount: {
        holderName: 'Simpsons',
        holderDocument: '99999999999',
        bank: '077',
        branchNumber: '492',
        branchCheckDigit: '1',
        accountNumber: '4929',
        accountCheckDigit: '22',
        type: 'conta_corrente',
      },
      metadata: [
        {
          key: '768093',
          value: 'Additional information',
        },
      ],
      transferPolicy: {
        transferDay: 5,
        transferEnabled: true,
        transferInterval: 'weekly',
        automaticAnticipationEnabled: false,
      },
    }

    const error = {
      error: {
        type: 'bad_request',
        code: 400,
        message: 'Bad Request Exception',
        details: [
          'owner.email must be an email',
          'mcc must be a number conforming to the specified constraints',
        ],
      },
    }

    server.use(
      request.post('https://api.malga.io/v1/sellers', (_, res, ctx) => {
        return res(ctx.status(400), ctx.json(error))
      }),
    )

    const sellers = new Sellers(api)

    try {
      await sellers.create(seller)
    } catch (err) {
      expect(err).toMatchObject(error)
    }
  })

  test('should succeed when find for a seller by ID', async () => {
    const sellerId = '00000000-0000-4000-8000-000000000006'
    const seller = {
      id: sellerId,
      createdAt: '2023-09-20T18:30:22.344Z',
      merchantId: '00000000-0000-4000-8000-000000000009',
      providers: [
        {
          providerType: 'sandbox',
          externalId: '232134423',
          externalStatus: 'active',
          externalStatusReason: 'ok',
          status: 'active',
          createdAt: '2023-09-20T18:30:22.344Z',
          updatedAt: '2023-09-20T18:30:22.344Z',
        },
      ],
      owner: {
        name: 'Homer Simpson',
        email: 'homer@simpsons.com',
        phoneNumber: '99999999999',
        birthdate: '1989-12-17',
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
      mcc: 1,
      bankAccount: {
        holderName: 'Simpsons',
        holderDocument: '99999999999',
        bank: '077',
        branchNumber: '492',
        branchCheckDigit: '1',
        accountNumber: '4929',
        accountCheckDigit: '22',
        type: 'conta_corrente',
      },
      metadata: [
        {
          key: '768093',
          value: 'Additional information',
        },
      ],
      transferPolicy: {
        transferDay: 5,
        transferEnabled: true,
        transferInterval: 'weekly',
        automaticAnticipationEnabled: false,
      },
    }

    server.use(
      request.get(
        `https://api.malga.io/v1/sellers/${sellerId}`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(seller))
        },
      ),
    )

    const sellers = new Sellers(api)
    const response = await sellers.find(sellerId)

    expect(response).toMatchObject(seller)
  })

  test('should generate an error when find for a non-existent seller', async () => {
    const sellerId = '00000000-0000-4000-8000-000000000006'

    const error = {
      error: {
        type: 'api_error',
        code: 404,
        message: 'Unexpected error',
      },
    }

    server.use(
      request.get(
        `https://api.malga.io/v1/sellers/${sellerId}`,
        (_, res, ctx) => {
          return res(ctx.status(404), ctx.json(error))
        },
      ),
    )

    const sellers = new Sellers(api)

    try {
      await sellers.find(sellerId)
    } catch (err) {
      expect(err).toMatchObject(error)
    }
  })

  test('should succeed in listing the sellers', async () => {
    const sellerList = {
      items: [
        {
          id: '00000000-0000-4000-8000-000000000006',
          createdAt: '2023-09-20T18:30:22.344Z',
          merchantId: '00000000-0000-4000-8000-000000000009',
          providers: [
            {
              providerType: 'sandbox',
              externalId: '232134423',
              externalStatus: 'active',
              externalStatusReason: 'ok',
              status: 'active',
              createdAt: '2023-09-20T18:30:22.344Z',
              updatedAt: '2023-09-20T18:30:22.344Z',
            },
          ],
          owner: {
            name: 'Homer Simpson',
            email: 'homer@simpsons.com',
            phoneNumber: '99999999999',
            birthdate: '1989-12-17',
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
          mcc: 1,
          bankAccount: {
            holderName: 'Simpsons',
            holderDocument: '99999999999',
            bank: '077',
            branchNumber: '492',
            branchCheckDigit: '1',
            accountNumber: '4929',
            accountCheckDigit: '22',
            type: 'conta_corrente',
          },
          metadata: [
            {
              key: '768093',
              value: 'Additional information',
            },
          ],
          transferPolicy: {
            transferDay: 5,
            transferEnabled: true,
            transferInterval: 'weekly',
            automaticAnticipationEnabled: false,
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
      request.get(`https://api.malga.io/v1/sellers`, (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(sellerList))
      }),
    )

    const sellers = new Sellers(api)
    const response = await sellers.list({
      limit: 15,
      page: 1,
      email: 'homer@simpsons.com',
      status: ['active'],
    })

    expect(response).toMatchObject(sellerList)
  })

  test('should generate an error when listing the sellers', async () => {
    server.use(
      request.get(`https://api.malga.io/v1/sellers`, (_, res, ctx) => {
        return res(ctx.status(500))
      }),
    )

    const sellers = new Sellers(api)

    try {
      await sellers.list({ limit: 15, page: 1 })
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

  test('should succeed in updating a seller', async () => {
    const sellerId = '00000000-0000-4000-8000-000000000006'

    const seller: Seller = {
      merchantId: '00000000-0000-4000-8000-000000000009',
      owner: {
        name: 'Homer Simpson',
        email: 'homer@simpsons.com',
        phoneNumber: '99999999999',
        birthdate: '1989-12-17',
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
      mcc: 1,
      bankAccount: {
        holderName: 'Simpsons',
        holderDocument: '99999999999',
        bank: '077',
        branchNumber: '492',
        branchCheckDigit: '1',
        accountNumber: '4929',
        accountCheckDigit: '22',
        type: 'conta_corrente',
      },
      metadata: [
        {
          key: '768093',
          value: 'Additional information',
        },
      ],
      transferPolicy: {
        transferDay: 5,
        transferEnabled: true,
        transferInterval: 'weekly',
        automaticAnticipationEnabled: false,
      },
    }

    const sellerResponse = {
      id: sellerId,
      createdAt: '2023-09-20T18:30:22.344Z',
      merchantId: '00000000-0000-4000-8000-000000000009',
      providers: [
        {
          providerType: 'sandbox',
          externalId: '232134423',
          externalStatus: 'active',
          externalStatusReason: 'ok',
          status: 'active',
          createdAt: '2023-09-20T18:30:22.344Z',
          updatedAt: '2023-09-20T18:30:22.344Z',
        },
      ],
      owner: {
        name: 'Homer Simpson',
        email: 'homer@simpsons',
        phoneNumber: '99999999999',
        birthdate: '1989-12-17',
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
      mcc: 1,
      bankAccount: {
        holderName: 'Simpsons',
        holderDocument: '99999999999',
        bank: '077',
        branchNumber: '492',
        branchCheckDigit: '1',
        accountNumber: '4929',
        accountCheckDigit: '22',
        type: 'conta_corrente',
      },
      metadata: [
        {
          key: '768093',
          value: 'Additional information',
        },
      ],
      transferPolicy: {
        transferDay: 5,
        transferEnabled: true,
        transferInterval: 'weekly',
        automaticAnticipationEnabled: false,
      },
    }

    server.use(
      request.patch(
        `https://api.malga.io/v1/sellers/${sellerId}`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(sellerResponse))
        },
      ),
    )

    const sellers = new Sellers(api)
    const response = await sellers.update(sellerId, seller)

    expect(response).toMatchObject(sellerResponse)
  })

  test('should generate an error when updating a seller', async () => {
    const sellerId = '00000000-0000-4000-8000-000000000006'

    const seller: Seller = {
      merchantId: '00000000-0000-4000-8000-000000000009',
      owner: {
        name: 'Homer Simpson',
        email: 'homer@simpsons',
        phoneNumber: '99999999999',
        birthdate: '1989-12-17',
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
      mcc: 1,
      bankAccount: {
        holderName: 'Simpsons',
        holderDocument: '99999999999',
        bank: '077',
        branchNumber: '492',
        branchCheckDigit: '1',
        accountNumber: '4929',
        accountCheckDigit: '22',
        type: 'conta_corrente',
      },
      metadata: [
        {
          key: '768093',
          value: 'Additional information',
        },
      ],
      transferPolicy: {
        transferDay: 5,
        transferEnabled: true,
        transferInterval: 'weekly',
        automaticAnticipationEnabled: false,
      },
    }

    const error = {
      error: {
        type: 'bad_request',
        code: 400,
        message: 'Bad Request Exception',
        details: [
          'owner.email must be an email',
          'mcc must be a number conforming to the specified constraints',
        ],
      },
    }

    server.use(
      request.patch(
        `https://api.malga.io/v1/sellers/${sellerId}`,
        (_, res, ctx) => {
          return res(ctx.status(400), ctx.json(error))
        },
      ),
    )

    const sellers = new Sellers(api)

    try {
      await sellers.update(sellerId, seller)
    } catch (err) {
      expect(err).toMatchObject(error)
    }
  })

  test('should succeed in removing a seller', async () => {
    const sellerId = '00000000-0000-4000-8000-000000000053'
    const merchantId = '00000000-0000-4000-8000-000000000054'

    server.use(
      request.delete(
        `https://api.malga.io/v1/sellers/${sellerId}`,
        (_, res, ctx) => {
          return res(ctx.status(200))
        },
      ),
    )

    const seller = new Sellers(api)
    const response = await seller.remove(sellerId, { merchantId })

    expect(response).toBeFalsy()
  })

  test('should fail when removing a seller', async () => {
    const sellerId = '00000000-0000-4000-8000-000000000053'
    const merchantId = '00000000-0000-4000-8000-000000000054'

    server.use(
      request.delete(
        `https://api.malga.io/v1/sellers/${sellerId}`,
        (_, res, ctx) => {
          return res(ctx.status(500))
        },
      ),
    )

    const seller = new Sellers(api)

    try {
      await seller.remove(sellerId, { merchantId })
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
