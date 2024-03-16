export interface ServicesMap {
  [key: string]: unknown;
}

export interface NamedServiceRecord<TServicesMap extends ServicesMap> {
  service: keyof TServicesMap;
  name: string;
}

export type ServiceKeysTuple<TServicesMap extends ServicesMap> = [
  ...(keyof TServicesMap | NamedServiceRecord<TServicesMap>)[],
];

export type ResolvedService<
  TServicesMap extends ServicesMap,
  T extends keyof TServicesMap | NamedServiceRecord<TServicesMap>,
> =
  T extends NamedServiceRecord<TServicesMap>
    ? TServicesMap[T["service"]]
    : T extends keyof TServicesMap
      ? TServicesMap[T]
      : never;

export type ResolvedServicesTuple<
  TServiceMap extends ServicesMap,
  Tuple extends ServiceKeysTuple<TServiceMap>,
> = {
  [K in keyof Tuple]: ResolvedService<TServiceMap, Tuple[K]>;
} & { length: Tuple["length"] };

export interface ServiceResolver<TServicesMap extends ServicesMap> {
  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey];

  resolveAll<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey
  ): TServicesMap[ServiceKey][];

  resolveTuple<ServiceKeys extends ServiceKeysTuple<TServicesMap>>(
    services: ServiceKeys
  ): ResolvedServicesTuple<TServicesMap, ServiceKeys>;

  has(key: keyof TServicesMap, name?: string): boolean;

  getServiceNames(key: keyof TServicesMap): string[];
}
