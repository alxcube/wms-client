/**
 * Services map.
 */
export interface ServicesMap {
  [key: string]: unknown;
}

/**
 * Object containing service key and name.
 */
export interface NamedServiceRecord<TServicesMap extends ServicesMap> {
  service: keyof TServicesMap;
  name: string;
}

/**
 * Array of service keys in ServicesMap or NamedServiceRecord objects.
 */
export type ServiceKeysTuple<TServicesMap extends ServicesMap> = [
  ...(keyof TServicesMap | NamedServiceRecord<TServicesMap>)[],
];

/**
 * Utility type. Resolves service type using ServicesMap and service key or NamedServiceRecord.
 */
export type ResolvedService<
  TServicesMap extends ServicesMap,
  T extends keyof TServicesMap | NamedServiceRecord<TServicesMap>,
> =
  T extends NamedServiceRecord<TServicesMap>
    ? TServicesMap[T["service"]]
    : T extends keyof TServicesMap
      ? TServicesMap[T]
      : never;

/**
 * Utility type. Maps service key / NamedServiceRecord array to resolved services array type.
 */
export type ResolvedServicesTuple<
  TServiceMap extends ServicesMap,
  Tuple extends ServiceKeysTuple<TServiceMap>,
> = {
  [K in keyof Tuple]: ResolvedService<TServiceMap, Tuple[K]>;
} & { length: Tuple["length"] };

/**
 * Service resolver interface.
 */
export interface ServiceResolver<TServicesMap extends ServicesMap> {
  /**
   * Resolves single service by its key in ServicesMap and optional name. If name is omitted or is `undefined`,
   * "default" is used as name.
   *
   * @param key
   * @param name
   */
  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey];

  /**
   * Resolves array of services, registered under given key with different names. Returns empty array, when there is
   * no services, registered under given key.
   *
   * @param key
   */
  resolveAll<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey
  ): TServicesMap[ServiceKey][];

  /**
   * Resolves tuple of services, using given array of service keys / NamedServiceRecord objects. Used to get independent
   * services in single resolution context, which means that same instance of services, having 'request' lifecycle
   * will be resolved. There is no need to call this method inside service factories, since they're already resolves
   * services in same context.
   *
   * @param services
   */
  resolveTuple<ServiceKeys extends ServiceKeysTuple<TServicesMap>>(
    services: ServiceKeys
  ): ResolvedServicesTuple<TServicesMap, ServiceKeys>;

  /**
   * Checks if given service exists. When name is omitted, returns true, when at least one registration of given service
   * exists, ignoring registration name. When name is passed, returns true if there exists registration of given service
   * with given name.
   *
   * @param key
   * @param name
   */
  has(key: keyof TServicesMap, name?: string): boolean;

  /**
   * Returns array of service names, registered under given key. If service was registered without explicit name,
   * it will have name "default".
   * @param key
   */
  getServiceNames(key: keyof TServicesMap): string[];
}
