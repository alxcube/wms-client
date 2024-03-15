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
  private readonly registry: Map<
    keyof TServicesMap,
    ServiceRegistration<TServicesMap, unknown>[]
  >;

  constructor() {
    this.registry = new Map();
  }

  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey] {
    const scope = new BaseServiceResolver(this.registry);
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

  unregister(key: keyof TServicesMap, name?: string) {
    if (name === undefined) {
      this.registry.delete(key);
      return;
    }
    const registrations = this.registry.get(key);
    if (registrations) {
      const registration = registrations.find((r) => r.name === name);
      if (registration) {
        registrations.splice(registrations.indexOf(registration), 1);
      }
      if (!registrations.length) {
        this.registry.delete(key);
      }
    }
  }

  private registerServiceOrFactory<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    serviceOrFactory:
      | TServicesMap[ServiceKey]
      | ServiceFactory<TServicesMap, TServicesMap[ServiceKey]>,
    isFactory: boolean,
    options: ServiceFactoryRegistrationOptions = {}
  ) {
    const existingRegistrations = this.registry.get(key) as
      | ServiceRegistration<TServicesMap, TServicesMap[ServiceKey]>[]
      | undefined;
    if (!existingRegistrations) {
      this.registry.set(key, [
        this.createRegistration(serviceOrFactory, isFactory, options),
      ]);
      return;
    }

    const { name = "default" } = options;

    const existingRegistration = existingRegistrations.find(
      (r) => r.name === name
    );

    if (!existingRegistration) {
      existingRegistrations.push(
        this.createRegistration(serviceOrFactory, isFactory, options)
      );
      return;
    }

    if (!options.replace) {
      throw new TypeError(
        `Service "${String(key)}", named "${name}", already registered. Set 'replace' option to true, if you want to replace registration.`
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
      name: options.name || "default",
      lifecycle: options.lifecycle || "transient",
      instance: !isFactory ? (serviceOrFactory as ServiceType) : undefined,
      factory: isFactory
        ? (serviceOrFactory as ServiceFactory<TServicesMap, ServiceType>)
        : undefined,
    };
  }
}
