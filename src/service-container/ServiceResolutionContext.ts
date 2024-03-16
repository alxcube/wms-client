import type {
  NamedServiceRecord,
  ServiceResolver,
  ServicesMap,
} from "./ServiceResolver";

export interface ServiceResolutionContext<TServicesMap extends ServicesMap>
  extends ServiceResolver<TServicesMap> {
  getStack(): NamedServiceRecord<TServicesMap>[];

  isResolvingFor(key: keyof TServicesMap, name?: string): boolean;

  isDirectlyResolvingFor(key: keyof TServicesMap, name?: string): boolean;
}
