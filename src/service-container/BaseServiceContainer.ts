import {
  BaseServiceResolutionContext,
  type ServiceRegistration,
} from "./BaseServiceResolutionContext";
import type {
  ServiceContainer,
  ServiceFactory,
  ServiceFactoryRegistrationOptions,
  ServiceRegistrationOptions,
} from "./ServiceContainer";
import type {
  ResolvedServicesTuple,
  ServiceKeysTuple,
  ServicesMap,
} from "./ServiceResolver";

export class BaseServiceContainer<TServicesMap extends ServicesMap>
  implements ServiceContainer<TServicesMap>
{
  private registry: Map<
    keyof TServicesMap,
    ServiceRegistration<TServicesMap, unknown>[]
  >;

  private readonly snapshots: Map<
    keyof TServicesMap,
    ServiceRegistration<TServicesMap, unknown>[]
  >[];

  constructor(private readonly parent?: BaseServiceContainer<TServicesMap>) {
    this.registry = new Map();
    this.snapshots = [];
  }

  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey] {
    return new BaseServiceResolutionContext(this.getMergedRegistry()).resolve(
      key,
      name
    );
  }

  resolveAll<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey
  ): TServicesMap[ServiceKey][] {
    return new BaseServiceResolutionContext(
      this.getMergedRegistry()
    ).resolveAll(key);
  }

  resolveTuple<ServiceKeys extends ServiceKeysTuple<TServicesMap>>(
    services: ServiceKeys
  ): ResolvedServicesTuple<TServicesMap, ServiceKeys> {
    return new BaseServiceResolutionContext(
      this.getMergedRegistry()
    ).resolveTuple(services);
  }

  registerConstant<ServiceKey extends keyof TServicesMap>(
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

  unregister(key: keyof TServicesMap, name?: string, cascade = false) {
    this.unregisterOwn(key, name);
    if (cascade && this.parent) {
      this.parent.unregister(key, name, true);
    }
  }

  has(key: keyof TServicesMap, name?: string): boolean {
    if (this.hasOwn(key, name)) {
      return true;
    }
    if (this.parent) {
      return this.parent.has(key, name);
    }
    return false;
  }

  hasOwn(key: keyof TServicesMap, name?: string): boolean {
    const registrations = this.registry.get(key);
    if (name === undefined) {
      return !!registrations?.length;
    }
    return !!registrations && !!registrations.find((r) => r.name === name);
  }

  createChild(): BaseServiceContainer<TServicesMap> {
    return new BaseServiceContainer(this);
  }

  getParent(): ServiceContainer<TServicesMap> | undefined {
    return this.parent;
  }

  backup(cascade = false) {
    const newRegistry: Map<
      keyof TServicesMap,
      ServiceRegistration<TServicesMap, unknown>[]
    > = new Map();
    for (const [key, registrations] of this.registry) {
      newRegistry.set(
        key,
        registrations.map((registration) => ({ ...registration }))
      );
    }
    this.snapshots.push(this.registry);
    this.registry = newRegistry;

    if (this.parent && cascade) {
      this.parent.backup(true);
    }
  }

  restore(cascade = false) {
    const snapshot = this.snapshots.pop();
    if (snapshot) {
      this.registry.clear();
      this.registry = snapshot;
    }
    if (this.parent && cascade) {
      this.parent.restore(true);
    }
  }

  getServiceNames(key: keyof TServicesMap): string[] {
    const mergedRegistry = this.getMergedRegistry();
    const registrations = mergedRegistry.get(key);
    if (!registrations) {
      return [];
    }
    return registrations.map(({ name }) => name);
  }

  private unregisterOwn(key: keyof TServicesMap, name?: string) {
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

  protected getMergedRegistry(): Map<
    keyof TServicesMap,
    ServiceRegistration<TServicesMap, unknown>[]
  > {
    if (!this.parent) {
      return this.registry;
    }
    const parentRegistry = this.parent.getMergedRegistry();
    const result: Map<
      keyof TServicesMap,
      ServiceRegistration<TServicesMap, unknown>[]
    > = new Map();

    const serviceKeys = new Set([
      ...parentRegistry.keys(),
      ...this.registry.keys(),
    ]);

    for (const serviceKey of serviceKeys) {
      const parentRegistrations = parentRegistry.get(serviceKey);
      const ownRegistrations = this.registry.get(serviceKey);
      if (!parentRegistrations && ownRegistrations) {
        result.set(serviceKey, ownRegistrations);
        continue;
      }
      if (!ownRegistrations && parentRegistrations) {
        result.set(serviceKey, parentRegistrations);
        continue;
      }
      if (parentRegistrations && ownRegistrations) {
        const mergedRegistrations = [...parentRegistrations];
        for (const registration of ownRegistrations) {
          const parentRegistration = mergedRegistrations.find(
            (r) => r.name === registration.name
          );
          if (parentRegistration) {
            mergedRegistrations.splice(
              mergedRegistrations.indexOf(parentRegistration),
              1,
              registration
            );
          } else {
            mergedRegistrations.push(registration);
          }
        }
        result.set(serviceKey, mergedRegistrations);
      }
    }

    return result;
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
