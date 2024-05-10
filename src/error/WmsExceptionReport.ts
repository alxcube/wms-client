import type { WmsException } from "./WmsException";

/**
 * Exception class, thrown when WMS server returned exception XML with multiple exception entries. Each entry is
 * represented as single WmsException in `exceptions` property.
 */
export class WmsExceptionReport extends Error {
  /**
   * WmsExceptionReport constructor.
   *
   * @param exceptions
   */
  constructor(readonly exceptions: WmsException[]) {
    super("WMS service exceptions occurred");
    this.name = "WmsExceptionReport";
  }
}
