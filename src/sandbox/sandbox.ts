import { Api } from 'src/common/api'

import {
  SandboxChangeChargeStatusPayload,
  SandboxChangeChargeStatusResponse,
  SandboxChangeAntifraudStatusPayload,
  SandboxChangeAntifraudStatusResponse,
  SandboxGenerateCardParams,
  SandboxGenerateCardResponse,
} from './interfaces'

import { cards } from './sandbox.utils'

export class Sandbox {
  constructor(
    private readonly api: Api,
    private readonly isSandbox: boolean,
  ) {}

  /**
   * Change the charge status in the sandbox
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sandbox/change-charge-status
   *
   * @param id - Charge ID
   * @param payload - Object with expected status
   * @returns Charge API response
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   *   options: { sandbox: true }
   * })
   *
   * const charge = await malga.sandbox.changeChargeStatus(
   *  '00000000-0000-4000-8000-000000000052',
   *  {
   *   status: 'voided'
   *  }
   * )
   * ```
   */
  public async changeChargeStatus(
    id: string,
    payload: SandboxChangeChargeStatusPayload,
  ): Promise<SandboxChangeChargeStatusResponse> {
    if (!this.isSandbox) {
      throw new Error(
        `This module only works in the sandbox environment. To enable it, simply pass:

        const malga = new Malga({
          apiKey: "<YOUR_API_KEY>,
          clientId: "<YOUR_CLIENT_ID>",
          options: { sandbox: true }
        })`,
      )
    }

    return this.api.post(`/charges/${id}`, payload)
  }

  /**
   * Change the antifraud status in the sandbox
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sandbox/change-antifraud-status
   *
   * @param id - Charge ID
   * @param payload - Object with expected status
   * @returns Charge API response
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   *   options: { sandbox: true }
   * })
   *
   * const charge = await malga.sandbox.changeAntifraudStatus(
   *  '00000000-0000-4000-8000-000000000052',
   *  {
   *   status: 'reproved'
   *  }
   * )
   * ```
   */
  public async changeAntifraudStatus(
    id: string,
    payload: SandboxChangeAntifraudStatusPayload,
  ): Promise<SandboxChangeAntifraudStatusResponse> {
    if (!this.isSandbox) {
      throw new Error(
        `This module only works in the sandbox environment. To enable it, simply pass:

        const malga = new Malga({
          apiKey: "<YOUR_API_KEY>,
          clientId: "<YOUR_CLIENT_ID>",
          options: { sandbox: true }
        })`,
      )
    }

    return this.api.patch(`/charges/${id}/antifraud`, payload)
  }

  /**
   * Card generator for use in a sandbox environment
   *
   * @link https://docs.malga.io/docs/api-sdks/docs/sandbox/generate-card
   *
   * @param params - Object with the card brand and the expected status
   * @returns card with `number`, `cvv` and `expirationDate`
   *
   * @example
   * ```
   * import { Malga } from 'malga'
   *
   * const malga = new Malga({
   *   apiKey: 'API_KEY',
   *   clientId: 'CLIENT_ID',
   *   options: { sandbox: true }
   * })
   *
   * const card = malga.sandbox.generateCard({
   *   brand: 'Mastercard',
   *   status: 'expired_card'
   * })
   * ```
   */
  public generateCard(
    params: SandboxGenerateCardParams,
  ): SandboxGenerateCardResponse {
    if (!this.isSandbox) {
      throw new Error(
        `This module only works in the sandbox environment. To enable it, simply pass:

        const malga = new Malga({
          apiKey: "<YOUR_API_KEY>,
          clientId: "<YOUR_CLIENT_ID>",
          options: { sandbox: true }
        })`,
      )
    }

    return cards[params.brand][params.status]
  }
}
