import type { WmsExceptionCode } from "./WmsExceptionCode";

export class WmsException extends Error {
  constructor(
    message: string,
    readonly code: WmsExceptionCode | string = "",
    readonly locator?: string
  ) {
    super(message);
  }
}
