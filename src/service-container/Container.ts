import { Context, type ServiceRegistration } from "./Context";
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

/**
 * Service container.
 */
export class Container<TServicesMap extends ServicesMap>
  implements ServiceContainer<TServicesMap>
{
  /**
   * Services registrations storage.
   *
   * @private
   */
  private registry: Map<
    keyof TServicesMap,
    ServiceRegistration<TServicesMap, unknown>[]
  >;

  /**
   * Backup snapshots stack.
   *
   * @private
   */
  private readonly snapshots: Map<
    keyof TServicesMap,
    ServiceRegistration<TServicesMap, unknown>[]
  >[];

  /**
   * Container constructor.
   *
   * @param parent
   */
  constructor(private readonly parent?: Container<TServicesMap>) {
    this.registry = new Map();
    this.snapshots = [];
  }

  /**
   * @inheritDoc
   */
  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey] {
    return new Context(this.getMergedRegistry()).resolve(key, name);
  }

  /**
   * @inheritDoc
   */
  resolveAll<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey
  ): TServicesMap[ServiceKey][] {
    return new Context(this.getMergedRegistry()).resolveAll(key);
  }

  /**
   * @inheritDoc
   */
  resolveTuple<ServiceKeys extends ServiceKeysTuple<TServicesMap>>(
    services: ServiceKeys
  ): ResolvedServicesTuple<TServicesMap, ServiceKeys> {
    return new Context(this.getMergedRegistry()).resolveTuple(services);
  }

  /**
   * @inheritDoc
   */
  registerConstant<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    service: TServicesMap[ServiceKey],
    options?: ServiceRegistrationOptions
  ) {
    this.registerConstantOrFactory(key, service, false, options);
  }

  /**
   * @inheritDoc
   */
  registerFactory<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    factory: ServiceFactory<TServicesMap, TServicesMap[ServiceKey]>,
    options?: ServiceFactoryRegistrationOptions
  ) {
    this.registerConstantOrFactory(key, factory, true, options);
  }

  /**
   * @inheritDoc
   */
  unregister(key: keyof TServicesMap, name?: string, cascade = false) {
    this.unregisterOwn(key, name);
    if (cascade && this.parent) {
      this.parent.unregister(key, name, true);
    }
  }

  /**
   * @inheritDoc
   */
  has(key: keyof TServicesMap, name?: string): boolean {
    if (this.hasOwn(key, name)) {
      return true;
    }
    if (this.parent) {
      return this.parent.has(key, name);
    }
    return false;
  }

  /**
   * @inheritDoc
   */
  hasOwn(key: keyof TServicesMap, name?: string): boolean {
    const registrations = this.registry.get(key);
    if (name === undefined) {
      return !!registrations?.length;
    }
    return !!registrations && !!registrations.find((r) => r.name === name);
  }

  /**
   * @inheritDoc
   */
  createChild(): Container<TServicesMap> {
    return new Container(this);
  }

  /**
   * @inheritDoc
   */
  getParent(): ServiceContainer<TServicesMap> | undefined {
    return this.parent;
  }

  /**
   * @inheritDoc
   */
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

  /**
   * @inheritDoc
   */
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

  /**
   * @inheritDoc
   */
  getServiceNames(key: keyof TServicesMap): string[] {
    const mergedRegistry = this.getMergedRegistry();
    const registrations = mergedRegistry.get(key);
    if (!registrations) {
      return [];
    }
    return registrations.map(({ name }) => name);
  }

  /**
   * Unregisters service from own registry.
   *
   * @param key
   * @param name
   * @private
   */
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

  /**
   * Returns service registry, resulting from merging parent container registry and own registry.
   *
   * @protected
   */
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

    // Get unique service keys from both registries.
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
        result.set(
          serviceKey,
          this.mergeRegistrations(parentRegistrations, ownRegistrations)
        );
      }
    }

    return result;
  }

  /**
   * Merges own concrete service registrations with parent registrations.
   *
   * @param parentRegistrations
   * @param ownRegistrations
   * @private
   */
  private mergeRegistrations<T>(
    parentRegistrations: ServiceRegistration<TServicesMap, T>[],
    ownRegistrations: ServiceRegistration<TServicesMap, T>[]
  ): ServiceRegistration<TServicesMap, T>[] {
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
    return mergedRegistrations;
  }

  /**
   * Registers constant or service factory.
   *
   * @param key
   * @param serviceOrFactory
   * @param isFactory
   * @param options
   * @private
   */
  private registerConstantOrFactory<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    serviceOrFactory:
      | TServicesMap[ServiceKey]
      | ServiceFactory<TServicesMap, TServicesMap[ServiceKey]>,
    isFactory: boolean,
    options: ServiceFactoryRegistrationOptions = {}
  ) {
    const registration = this.createRegistration(
      serviceOrFactory,
      isFactory,
      options
    );

    const existingRegistrations = this.registry.get(key) as
      | ServiceRegistration<TServicesMap, TServicesMap[ServiceKey]>[]
      | undefined;
    if (!existingRegistrations) {
      this.registry.set(key, [registration]);
      return;
    }

    const { name } = registration;
    const existingRegistration = existingRegistrations.find(
      (r) => r.name === name
    );
    if (!existingRegistration) {
      existingRegistrations.push(registration);
      return;
    }

    if (!options.replace) {
      throw new TypeError(
        `Service "${String(key)}", named "${name}", already registered. Set 'replace' option to true, if you want to replace registration.`
      );
    }

    const index = existingRegistrations.indexOf(existingRegistration);
    existingRegistrations.splice(index, 1, registration);
  }

  /**
   * Creates registration object.
   *
   * @param serviceOrFactory
   * @param isFactory
   * @param options
   * @private
   */
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
