export interface ServicesMap {
  [key: string]: unknown;
}

export interface ServiceResolver<TServicesMap extends ServicesMap> {
  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey];
  has(key: keyof TServicesMap, name?: string): boolean;
}

export interface ServiceFactory<TServicesMap extends ServicesMap, ServiceType> {
  (resolver: ServiceResolver<TServicesMap>): ServiceType;
}

export type ServiceLifecycle = "transient" | "singleton" | "request";

export interface ServiceRegistrationOptions {
  name?: string;
  replace?: true;
}

export interface ServiceFactoryRegistrationOptions
  extends ServiceRegistrationOptions {
  lifecycle?: ServiceLifecycle;
}
export interface ServiceContainer<TServicesMap extends ServicesMap>
  extends ServiceResolver<TServicesMap> {
  registerService<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    service: TServicesMap[ServiceKey],
    options?: ServiceRegistrationOptions
  ): void;

  registerFactory<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    factory: ServiceFactory<TServicesMap, TServicesMap[ServiceKey]>,
    options?: ServiceFactoryRegistrationOptions
  ): void;

  unregister(key: keyof TServicesMap, name?: string): void;
}
