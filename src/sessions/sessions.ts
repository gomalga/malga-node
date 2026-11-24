import { Api } from 'src/common/api'
import { ApiPostOptions } from 'src/common/interfaces'

import {
  SessionCreatePayload,
  SessionCreateResponse,
  SessionFindResponse,
  SessionListParams,
  SessionListResponse,
  SessionCancelResponse,
  SessionToggleActiveStatusResponse,
} from './interfaces'

export class Sessions {
  constructor(private readonly api: Api) {}

  /**
   * Create a session
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sessions/create-session
   *
   * @param payload - Session object
   * @param options - API options like `idempotencyKey`
   * @returns Session API response
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * const session = await malga.sessions.create({
   *   name: 'First Session',
   *   amount: 100,
   *   merchantId: '00000000-0000-4000-8000-000000000009',
   *   dueDate: '2023-12-27T03:00:00.000Z',
   *   paymentMethods: [
   *     { paymentType: 'credit', installments: 1 },
   *     { paymentType: 'pix', expiresIn: 60 },
   *   ],
   *   items: [
   *     { name: 'Product 1', quantity: 1, unitPrice: 100 },
   *   ],
   * })
   * ```
   */
  public async create(
    payload: SessionCreatePayload,
    options?: ApiPostOptions,
  ): Promise<SessionCreateResponse> {
    return this.api.post('/sessions', payload, options?.idempotencyKey)
  }

  /**
   * Find session details
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sessions/find-session
   *
   * @param id - Session ID
   * @returns Session API response
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * const session = await malga.sessions.find('00000000-0000-4000-8000-000000000010')
   * ```
   */
  public async find(id: string): Promise<SessionFindResponse> {
    return this.api.get(`/sessions/${id}`)
  }

  /**
   * List the sessions
   *
   * @param params - Filter params
   * @returns Session API response
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sessions/list-sessions
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * const sessions = await malga.sessions.list({
   *   page: 1,
   *   limit: 15,
   *   startDate: '2023-09-17T03:00:00.000Z',
   *   endDate: '2023-09-23T02:59:59.999Z',
   * })
   * ```
   */
  public async list(params?: SessionListParams): Promise<SessionListResponse> {
    const parsedParams = {
      page: params?.page,
      limit: params?.limit,
      status: params?.status?.join(),
      isActive: params?.isActive?.join(),
      'created.gt': params?.startDate,
      'created.lt': params?.endDate,
    }

    return this.api.paginate('/sessions', parsedParams)
  }

  /**
   * Cancel the session
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sessions/cancel-session
   *
   * @param id - Session ID
   * @returns Session API response
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * await malga.sessions.cancel('00000000-0000-4000-8000-000000000036')
   * ```
   */
  public async cancel(id: string): Promise<SessionCancelResponse> {
    return this.api.post(`/sessions/${id}/cancel`)
  }

  /**
   * Enable the session
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sessions/enable-session
   *
   * @param id - Session ID
   * @returns Session API response
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * await malga.sessions.enable('00000000-0000-4000-8000-000000000036')
   * ```
   */
  public async enable(id: string): Promise<SessionToggleActiveStatusResponse> {
    return this.api.patch(`/sessions/${id}`, { isActive: true })
  }

  /**
   * Disable the session
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sessions/disable-session
   *
   * @param id - Session ID
   * @returns Session API response
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * await malga.sessions.disable('00000000-0000-4000-8000-000000000036')
   * ```
   */
  public async disable(id: string): Promise<SessionToggleActiveStatusResponse> {
    return this.api.patch(`/sessions/${id}`, { isActive: false })
  }
}
