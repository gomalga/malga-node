import { Api } from 'src/common/api'

import { ApiPostOptions } from 'src/common/interfaces'

import {
  CardCreatePayload,
  CardCreateResponse,
  CardListParams,
  CardFindResponse,
  CardListResponse,
  CardTokenizationPayload,
  CardTokenizationResponse,
} from './interfaces'

export class Cards {
  constructor(private readonly api: Api) {}

  /**
   * Create a card
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/cards/create-card
   *
   * @param payload - Card object
   * @param options - API options like `idempotencyKey`
   * @returns Card API response
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
   * const card = await malga.cards.create({
   *   tokenId: '00000000-0000-4000-8000-000000000008',
   *   zeroDollar: {
   *     merchantId: '00000000-0000-4000-8000-000000000009',
   *     cvvCheck: true
   *   }
   * })
   * ```
   */
  public async create(
    payload: CardCreatePayload,
    options?: ApiPostOptions,
  ): Promise<CardCreateResponse> {
    return this.api.post('/cards', payload, options?.idempotencyKey)
  }

  /**
   * Find card details
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/cards/find-card
   *
   * @param id - Card ID
   * @returns Card API response
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
   * const card = await malga.cards.find('00000000-0000-4000-8000-000000000010')
   * ```
   */
  public async find(id: string): Promise<CardFindResponse> {
    return this.api.get(`/cards/${id}`)
  }

  /**
   * List the cards
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/cards/list-cards
   *
   * @param params - Filter params
   * @returns Card API response
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
   * const cards = await malga.cards.list({
   *   page: 1,
   *   limit: 15,
   * })
   * ```
   */
  public async list(params?: CardListParams): Promise<CardListResponse> {
    return this.api.paginate('/cards', params)
  }

  /**
   * Create a tokenized card or CVV
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/cards/tokenization-card
   *
   * @param payload - Token object
   * @param options - API options like `idempotencyKey`
   * @returns Token API response
   *
   * @example
   * Here is an example of how to tokenize a card:
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * const tokenId = await malga.cards.tokenization({
   *   holderName: 'Homer Simpson',
   *   number: '5402502027127339'
   *   cvv: '391',
   *   expirationDate: '01/2025'
   * })
   * ```
   *
   * @example
   * Here is an example of how to tokenize a CVV:
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * const tokenCvv = await malga.cards.tokenization({
   *   cvv: '170',
   * })
   * ```
   */
  public async tokenization(
    payload: CardTokenizationPayload,
    options?: ApiPostOptions,
  ): Promise<CardTokenizationResponse> {
    const shouldTokenizeCard = [
      'holderName',
      'number',
      'cvv',
      'expirationDate',
    ].every((key) => !!payload[key as keyof CardTokenizationPayload])

    const parsedPayload = shouldTokenizeCard
      ? {
          cardNumber: payload.number,
          cardCvv: payload.cvv,
          cardExpirationDate: payload.expirationDate,
          cardHolderName: payload.holderName,
        }
      : { cvvUpdate: payload.cvv }

    return this.api.post('/tokens', parsedPayload, options?.idempotencyKey)
  }
}
