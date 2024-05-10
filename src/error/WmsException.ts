import type { WmsExceptionCode } from "./WmsExceptionCode";

/**
 * WMS exception object. Represents single entry of WMS exception report XML.
 */
export class WmsException extends Error {
  /**
   * WmsException constructor.
   *
   * @param message
   * @param code
   * @param locator
   */
  constructor(
    message: string,
    readonly code: WmsExceptionCode | string = "",
    readonly locator?: string
  ) {
    super(message);
    this.name = "WmsException";
  }
}
