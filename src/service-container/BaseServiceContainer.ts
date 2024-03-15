import {
  BaseServiceResolver,
  type ServiceRegistration,
} from "./BaseServiceResolver";
import type {
  ServiceContainer,
  ServiceFactory,
  ServiceFactoryRegistrationOptions,
  ServiceRegistrationOptions,
  ServicesMap,
} from "./ServiceContainer";

export class BaseServiceContainer<TServicesMap extends ServicesMap>
  implements ServiceContainer<TServicesMap>
{
  private readonly registrations: Map<
    keyof TServicesMap,
    ServiceRegistration<TServicesMap, unknown>[]
  >;

  constructor() {
    this.registrations = new Map();
  }

  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey] {
    const scope = new BaseServiceResolver(this.registrations);
    return scope.resolve(key, name);
  }

  registerService<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    service: TServicesMap[ServiceKey],
    options?: ServiceRegistrationOptions
  ) {
    this.registerServiceOrFactory(key, service, false, options);
  }

  registerFactory<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    factory: ServiceFactory<TServicesMap, TServicesMap[ServiceKey]>,
    options?: ServiceFactoryRegistrationOptions
  ) {
    this.registerServiceOrFactory(key, factory, true, options);
  }

  private registerServiceOrFactory<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    serviceOrFactory:
      | TServicesMap[ServiceKey]
      | ServiceFactory<TServicesMap, TServicesMap[ServiceKey]>,
    isFactory: boolean,
    options: ServiceFactoryRegistrationOptions = {}
  ) {
    const existingRegistrations = this.registrations.get(key) as
      | ServiceRegistration<TServicesMap, TServicesMap[ServiceKey]>[]
      | undefined;
    if (!existingRegistrations) {
      this.registrations.set(key, [
        this.createRegistration(serviceOrFactory, isFactory, options),
      ]);
      return;
    }

    const existingRegistration = existingRegistrations.find(
      (r) => r.name === options.name
    );

    if (!existingRegistration) {
      existingRegistrations.push(
        this.createRegistration(serviceOrFactory, isFactory, options)
      );
      return;
    }

    if (!options.replace) {
      const named = options.name ? `, named "${options.name}",` : "";
      throw new TypeError(
        `Service "${String(key)}"${named} already registered. Set 'replace' option to true, if you want to replace registration.`
      );
    }

    const index = existingRegistrations.indexOf(existingRegistration);
    existingRegistrations.splice(
      index,
      1,
      this.createRegistration(serviceOrFactory, isFactory, options)
    );
  }

  private createRegistration<ServiceType>(
    serviceOrFactory: ServiceType | ServiceFactory<TServicesMap, ServiceType>,
    isFactory: boolean,
    options: ServiceFactoryRegistrationOptions
  ): ServiceRegistration<TServicesMap, ServiceType> {
    return {
      name: options.name,
      lifecycle: options.lifecycle || "transient",
      instance: !isFactory ? (serviceOrFactory as ServiceType) : undefined,
      factory: isFactory
        ? (serviceOrFactory as ServiceFactory<TServicesMap, ServiceType>)
        : undefined,
    };
  }
}
