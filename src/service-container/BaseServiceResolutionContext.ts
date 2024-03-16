import type { ServiceFactory, ServiceLifecycle } from "./ServiceContainer";
import type {
  ServiceResolutionContext,
  ServiceResolutionStackEntry,
} from "./ServiceResolutionContext";
import type { ServicesMap } from "./ServiceResolver";

export interface ServiceRegistration<SMap extends ServicesMap, ServiceType> {
  instance?: ServiceType;
  factory?: ServiceFactory<SMap, ServiceType>;
  name: string;
  lifecycle: ServiceLifecycle;
}

export class BaseServiceResolutionContext<TServicesMap extends ServicesMap>
  implements ServiceResolutionContext<TServicesMap>
{
  private readonly resolved: Map<
    keyof TServicesMap,
    { name: string; service: unknown }[]
  >;

  private readonly resolutionStack: ServiceResolutionStackEntry<TServicesMap>[];

  constructor(
    private readonly registry: Map<
      keyof TServicesMap,
      ServiceRegistration<TServicesMap, unknown>[]
    >
  ) {
    this.resolved = new Map();
    this.resolutionStack = [];
  }

  resolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name = "default"
  ): TServicesMap[ServiceKey] {
    this.resolutionStack.push({ service: key, name });
    try {
      return this.doResolve(key, name);
    } finally {
      this.resolutionStack.pop();
    }
  }

  has(key: keyof TServicesMap, name?: string): boolean {
    const registrations = this.registry.get(key);
    if (name === undefined) {
      return !!registrations?.length;
    }
    return !!registrations && !!registrations.find((r) => r.name === name);
  }

  getStack(): ServiceResolutionStackEntry<TServicesMap>[] {
    return [...this.resolutionStack];
  }

  isResolvingFor(key: keyof TServicesMap, name?: string): boolean {
    return !!this.resolutionStack.find((entry) => {
      return (
        entry.service === key && (name === undefined || entry.name === name)
      );
    });
  }

  isDirectlyResolvingFor(key: keyof TServicesMap, name?: string): boolean {
    if (this.resolutionStack.length < 2) {
      // Call made from resolution root.
      return false;
    }
    const resolvingFor = this.resolutionStack[this.resolutionStack.length - 2];
    return (
      resolvingFor.service === key &&
      (name === undefined || resolvingFor.name === name)
    );
  }

  private doResolve<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    name = "default"
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
    name: string
  ): TServicesMap[ServiceKey] | undefined {
    const resolved = this.resolved.get(key) as
      | { name: string; service: TServicesMap[ServiceKey] }[]
      | undefined;
    if (!resolved) {
      return;
    }
    const named = resolved.find((record) => record.name === name);
    return (named && named.service) || undefined;
  }

  private saveInResolved<ServiceKey extends keyof TServicesMap>(
    key: ServiceKey,
    service: TServicesMap[ServiceKey],
    name: string
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
    name: string
  ): ServiceRegistration<TServicesMap, TServicesMap[ServiceKey]> {
    const registrations = this.registry.get(key) as
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
