import type { ServiceResolutionContext } from "./ServiceResolutionContext";
import type { ServiceResolver, ServicesMap } from "./ServiceResolver";

export interface ServiceFactory<TServicesMap extends ServicesMap, ServiceType> {
  (context: ServiceResolutionContext<TServicesMap>): ServiceType;
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

  unregister(key: keyof TServicesMap, name?: string, cascade?: boolean): void;

  createChild(): ServiceContainer<TServicesMap>;

  hasOwn(key: keyof TServicesMap, name?: string): boolean;

  getParent(): ServiceContainer<TServicesMap> | undefined;

  backup(cascade?: boolean): void;

  restore(cascade?: boolean): void;
}
