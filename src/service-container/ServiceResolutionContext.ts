import type { ServiceResolver, ServicesMap } from "./ServiceResolver";

export interface ServiceResolutionStackEntry<TServicesMap extends ServicesMap> {
  service: keyof TServicesMap;
  name: string;
}
export interface ServiceResolutionContext<TServicesMap extends ServicesMap>
  extends ServiceResolver<TServicesMap> {
  getStack(): ServiceResolutionStackEntry<TServicesMap>[];

  isResolvingFor(key: keyof TServicesMap, name?: string): boolean;

  isDirectlyResolvingFor(key: keyof TServicesMap, name?: string): boolean;
}
