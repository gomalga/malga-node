import { Api } from 'src/common/api'
import { ApiPostOptions } from 'src/common/interfaces'

import {
  CustomerFindResponse,
  CustomerUpdatePayload,
  CustomerUpdateResponse,
  CustomerListParams,
  CustomerCardsResponse,
  CustomerLinkCardPayload,
  CustomerCreateOptions,
  CustomerCreatePayload,
  CustomerCreateResponse,
  CustomerListResponse,
} from './interfaces'

export class Customers {
  constructor(private readonly api: Api) {}

  /**
   * Create a customer
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/customers/create-customer
   *
   * @param payload - Customer object
   * @param options - API options like `idempotencyKey`
   * @returns Customer API response
   *
   * @example
   * Here is an example of how to create a customer
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * const customer = await malga.customers.create({
   *   name: 'Homer Simpson',
   *   email: 'homer@simpsons.com',
   *   phoneNumber: '99999999999',
   *   document: {
   *     type: 'cpf',
   *     number: '99999999999',
   *     country: 'BR',
   *   },
   *   address: {
   *     street: 'Evergreen Terrace',
   *     streetNumber: '742',
   *     zipCode: '62629',
   *     country: 'US',
   *     state: 'Louisiana',
   *     city: 'Springfield',
   *     district: 'Suburb',
   *     complement: 'Residence',
   *   },
   * })
   * ```
   *
   * * @example
   * Here is an example of how to create a customer while removing email and document duplication checks
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   * })
   *
   * const customer = await malga.customers.create({
   *   name: 'Homer Simpson',
   *   email: 'homer@simpsons.com',
   *   phoneNumber: '99999999999',
   *   document: {
   *     type: 'cpf',
   *     number: '99999999999',
   *     country: 'BR',
   *   },
   *   address: {
   *     street: 'Evergreen Terrace',
   *     streetNumber: '742',
   *     zipCode: '62629',
   *     country: 'US',
   *     state: 'Louisiana',
   *     city: 'Springfield',
   *     district: 'Suburb',
   *     complement: 'Residence',
   *   },
   * }, { force: true })
   * ```
   */
  public async create(
    payload: CustomerCreatePayload,
    options?: CustomerCreateOptions,
  ): Promise<CustomerCreateResponse> {
    const endpoint = options?.force
      ? `/customers?force=${!!options.force}`
      : '/customers'

    return this.api.post(endpoint, payload, options?.idempotencyKey)
  }

  /**
   * Find customer details
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/customers/find-customer
   *
   * @param id - Customer ID
   * @returns Customer API response
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
   * const customer = await malga.customers.find('00000000-0000-4000-8000-000000000010')
   * ```
   */
  public async find(id: string): Promise<CustomerFindResponse> {
    return this.api.get(`/customers/${id}`)
  }

  /**
   * List the customers
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/customers/list-customers
   *
   * @param params - Filter params
   * @returns Customer API response
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
   * const customers = await malga.customers.list({ page: 1, limit: 15 })
   * ```
   */
  public async list(
    params?: CustomerListParams,
  ): Promise<CustomerListResponse> {
    const parsedParams = {
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
      'document.type': params?.documentType,
      'document.number': params?.documentNumber,
    }

    return this.api.paginate('/customers', parsedParams)
  }

  /**
   * Update the customer
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/customers/update-customer
   *
   * @param id - Customer ID
   * @param payload - Updated customer object
   * @returns Customer API response
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
   * const customer = await malga.customers.update(
   *  '00000000-0000-4000-8000-000000000036',
   *  { name: 'Bart Simpson', phoneNumber: '99999999998' }
   * )
   * ```
   */
  public async update(
    id: string,
    payload: CustomerUpdatePayload,
  ): Promise<CustomerUpdateResponse> {
    return this.api.patch(`/customers/${id}`, payload)
  }

  /**
   * Remove the customer
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/customers/remove-customer
   *
   * @param id - Customer ID
   * @returns void
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
   * await malga.customers.remove('00000000-0000-4000-8000-000000000036')
   * ```
   */
  public async remove(id: string): Promise<void> {
    return this.api.delete(`/customers/${id}`)
  }

  /**
   * List customer cards
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/customers/find-customer
   *
   * @param id - Customer ID
   * @returns void
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
   * const customerCards = await malga.customers.cards('00000000-0000-4000-8000-000000000036')
   * ```
   */
  public async cards(id: string): Promise<CustomerCardsResponse[]> {
    return this.api.get(`/customers/${id}/cards`)
  }

  /**
   * Link customer to card
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/customers/link-card-customer
   *
   * @param id - Customer ID
   * @param payload - Card informations
   * @returns void
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
   * await malga.customers.linkCard('00000000-0000-4000-8000-000000000036', {
   *   cardId: '00000000-0000-4000-8000-000000000045'
   * })
   * ```
   */
  public async linkCard(
    id: string,
    payload: CustomerLinkCardPayload,
    options?: ApiPostOptions,
  ): Promise<void> {
    return this.api.post(
      `/customers/${id}/cards`,
      payload,
      options?.idempotencyKey,
    )
  }
}
