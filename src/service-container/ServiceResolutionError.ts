import type { NamedServiceRecord, ServicesMap } from "./ServiceResolver";

export class ServiceResolutionError<
  TServicesMap extends ServicesMap,
> extends Error {
  constructor(
    message: string,
    readonly resolutionStack: NamedServiceRecord<TServicesMap>[],
    readonly cause?: Error | unknown
  ) {
    super(message);
    this.name = "ServiceResolutionError";
  }
}
