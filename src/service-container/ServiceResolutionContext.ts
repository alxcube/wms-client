import type {
  NamedServiceRecord,
  ServiceResolver,
  ServicesMap,
} from "./ServiceResolver";

/**
 * Service resolution context object interface. This interface is passed to ServiceFactory.
 */
export interface ServiceResolutionContext<TServicesMap extends ServicesMap>
  extends ServiceResolver<TServicesMap> {
  /**
   * Returns array of service resolution stack, which has records of services stack being resolved in current request.
   * The first element (at index 0) is the root service, for which dependencies are resolved. The last element is
   * service name, being resolved at the moment.
   */
  getStack(): NamedServiceRecord<TServicesMap>[];

  /**
   * Returns true, when current service is being resolved as ancestor dependency for given service key. Ignores
   * service name, while checking, if 'name' argument is omitted.
   *
   * @param key
   * @param name
   */
  isResolvingFor(key: keyof TServicesMap, name?: string): boolean;

  /**
   * Returns true, when current service is being resolved directly for service of given key. Ignores service name,
   * if 'name' argument is omitted.
   *
   * @param key
   * @param name
   */
  isDirectlyResolvingFor(key: keyof TServicesMap, name?: string): boolean;
}
