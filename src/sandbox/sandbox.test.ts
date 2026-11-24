import { server, request } from 'tests'
import { Api } from 'src/common/api'

import { Sandbox } from './sandbox'

import { expirationDate } from './sandbox.utils'

const api = new Api({
  apiKey: 'API_KEY',
  clientId: 'CLIENT_ID',
  options: { sandbox: true },
})

describe('Sandbox', () => {
  test('should succeed in changing the status of a charge in the sandbox', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000026'
    const charge = {
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
      appInfo: null,
    }

    server.use(
      request.post(
        `https://sandbox-api.malga.io/v1/charges/${chargeId}`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(charge))
        },
      ),
    )

    const sandbox = new Sandbox(api, true)
    const response = await sandbox.changeChargeStatus(chargeId, {
      status: 'authorized',
    })
    expect(response).toMatchObject(charge)
  })

  test('should fail when changing the status of a transaction in the sandbox', async () => {
    const sandbox = new Sandbox(api, false)

    try {
      await sandbox.changeChargeStatus('00000000-0000-4000-8000-000000000026', {
        status: 'pre_authorized',
      })
    } catch (err) {
      expect(!!err).toBeTruthy()
    }
  })

  test('should succeed in changing the status of antifraud in the sandbox', async () => {
    const chargeId = '00000000-0000-4000-8000-000000000026'
    const charge = {
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
      appInfo: null,
    }

    server.use(
      request.patch(
        `https://sandbox-api.malga.io/v1/charges/${chargeId}/antifraud`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(charge))
        },
      ),
    )

    const sandbox = new Sandbox(api, true)
    const response = await sandbox.changeAntifraudStatus(chargeId, {
      status: 'reproved',
    })
    expect(response).toMatchObject(charge)
  })

  test('should fail when changing the status of antifraud in the sandbox', async () => {
    const sandbox = new Sandbox(api, false)

    try {
      await sandbox.changeChargeStatus('00000000-0000-4000-8000-000000000026', {
        status: 'pre_authorized',
      })
    } catch (err) {
      expect(!!err).toBeTruthy()
    }
  })

  test('should succeed in generating a test card in the sandbox', async () => {
    const sandbox = new Sandbox(api, true)
    const card = sandbox.generateCard({
      brand: 'Mastercard',
      status: 'authorized',
    })

    expect(card).toMatchObject({
      number: '5214254988499590',
      cvv: '220',
      expirationDate,
    })
  })

  test('should fail when generating a test card in the sandbox', async () => {
    const sandbox = new Sandbox(api, false)

    try {
      sandbox.generateCard({ brand: 'Amex', status: 'authorized' })
    } catch (err) {
      expect(!!err).toBeTruthy()
    }
  })
})
