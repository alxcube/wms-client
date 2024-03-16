export interface ServicesMap {
  [key: string]: unknown;
}

export interface ServiceResolver<TServicesMap extends ServicesMap> {
  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey];

  resolveAll<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey
  ): TServicesMap[ServiceKey][];

  has(key: keyof TServicesMap, name?: string): boolean;
}
