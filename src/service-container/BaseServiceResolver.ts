import type {
  ServiceFactory,
  ServiceLifecycle,
  ServiceResolver,
  ServicesMap,
} from "./ServiceContainer";

export interface ServiceRegistration<SMap extends ServicesMap, ServiceType> {
  instance?: ServiceType;
  factory?: ServiceFactory<SMap, ServiceType>;
  name?: string;
  lifecycle: ServiceLifecycle;
}

export class BaseServiceResolver<TServicesMap extends ServicesMap>
  implements ServiceResolver<TServicesMap>
{
  private readonly resolved: Map<
    keyof TServicesMap,
    { name?: string; service: unknown }[]
  >;

  constructor(
    private readonly registrations: Map<
      keyof TServicesMap,
      ServiceRegistration<TServicesMap, unknown>[]
    >
  ) {
    this.resolved = new Map();
  }

  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey] {
    const alreadyResolved = this.getFromResolved(key, name);
    if (alreadyResolved) {
      return alreadyResolved;
    }

    const registration = this.getServiceRegistration(key, name);

    if (registration.instance) {
      return registration.instance;
    }

    if (!registration.factory) {
      throw new TypeError(
        `Service "${String(key)}" has neither instance, nor factory.`
      );
    }

    let instance: TServicesMap[ServiceKey];
    try {
      instance = registration.factory(this);
    } catch (e) {
      throw new Error(
        `An error occurred in "${String(key)}" service factory: ${e}`
      );
    }

    if (["singleton", "request"].includes(registration.lifecycle)) {
      this.saveInResolved(key, instance, name);

      if (registration.lifecycle === "singleton") {
        registration.instance = instance;
      }
    }

    return instance;
  }

  private getFromResolved<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name?: string
  ): TServicesMap[ServiceKey] | undefined {
    const resolved = this.resolved.get(key) as
      | { name?: string; service: TServicesMap[ServiceKey] }[]
      | undefined;
    if (!resolved) {
      return;
    }
    if (!name) {
      return resolved[0].service;
    }
    const named = resolved.find((record) => record.name === name);
    return (named && named.service) || undefined;
  }

  private saveInResolved<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    service: TServicesMap[ServiceKey],
    name: string | undefined
  ): void {
    const existingResolved = this.resolved.get(key);
    if (!existingResolved) {
      this.resolved.set(key, [{ service, name }]);
      return;
    }
    const existingNamed = existingResolved.find(
      (record) => record.name === name
    );
    if (existingNamed) {
      existingNamed.service = service;
      return;
    }

    existingResolved.push({ service, name });
  }

  private getServiceRegistration<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name: string | undefined
  ): ServiceRegistration<TServicesMap, TServicesMap[ServiceKey]> {
    const registrations = this.registrations.get(key) as
      | ServiceRegistration<TServicesMap, TServicesMap[ServiceKey]>[]
      | undefined;
    if (!registrations) {
      throw new RangeError(`Service "${String(key)}" is not found.`);
    }
    const registration = registrations.find((record) => record.name === name);
    if (!registration) {
      throw new RangeError(
        `Service "${String(key)}", named "${name}" is not found.`
      );
    }
    return registration;
  }
}
