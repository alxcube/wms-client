import type { WmsException } from "./WmsException";

export class WmsExceptionReport extends Error {
  constructor(readonly exceptions: WmsException[]) {
    super("WMS service exceptions occurred");
  }
}
