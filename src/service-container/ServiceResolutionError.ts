import type { ServiceResolutionStackEntry } from "./ServiceResolutionContext";
import type { ServicesMap } from "./ServiceResolver";

export class ServiceResolutionError<
  TServicesMap extends ServicesMap,
> extends Error {
  constructor(
    message: string,
    readonly resolutionStack: ServiceResolutionStackEntry<TServicesMap>[],
    readonly cause?: Error | unknown
  ) {
    super(message);
    this.name = "ServiceResolutionError";
  }
}
