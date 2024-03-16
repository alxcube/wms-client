import { beforeEach, describe, expect, it } from "vitest";
import {
  BaseServiceResolutionContext,
  type ServiceRegistration,
} from "../../../src/service-container/BaseServiceResolutionContext";
import { ServiceResolutionError } from "../../../src/service-container/ServiceResolutionError";

import type { ServicesMap } from "../../../src/service-container/ServiceResolver";

describe("BaseServiceResolutionContext class", () => {
  class DummyService {}
  class DummyServiceContainer {
    constructor(private readonly DummyService: DummyService) {}

    getDecoder(): DummyService {
      return this.DummyService;
    }
  }
  interface TestServicesMap extends ServicesMap {
    DummyService: DummyService;
    TransientDummyService: DummyService;
    SingletonDummyService: DummyService;
    RequestDummyService: DummyService;
    NamedDummyService: DummyService;
    AlwaysNamedDummyService: DummyService;
    DummyServiceContainer: DummyServiceContainer;
  }

  let dummyServiceInstance: DummyService;
  let registry: Map<
    keyof TestServicesMap,
    ServiceRegistration<TestServicesMap, unknown>[]
  >;
  let resolver: BaseServiceResolutionContext<TestServicesMap>;

  beforeEach(() => {
    dummyServiceInstance = new DummyService();
    const DummyServiceFactory = () => new DummyService();
    registry = new Map();
    registry.set("DummyService", [
      {
        name: "default",
        instance: dummyServiceInstance,
        lifecycle: "singleton",
      },
    ]);
    registry.set("TransientDummyService", [
      { name: "default", factory: DummyServiceFactory, lifecycle: "transient" },
    ]);
    registry.set("SingletonDummyService", [
      { name: "default", factory: DummyServiceFactory, lifecycle: "singleton" },
    ]);
    registry.set("RequestDummyService", [
      { name: "default", factory: DummyServiceFactory, lifecycle: "request" },
    ]);
    registry.set("NamedDummyService", [
      { name: "default", factory: DummyServiceFactory, lifecycle: "transient" },
      {
        factory: DummyServiceFactory,
        lifecycle: "singleton",
        name: "Singleton",
      },
      {
        factory: DummyServiceFactory,
        lifecycle: "request",
        name: "Request",
      },
    ]);
    registry.set("AlwaysNamedDummyService", [
      { name: "name", factory: DummyServiceFactory, lifecycle: "singleton" },
    ]);
    registry.set("DummyServiceContainer", [
      {
        name: "default",
        factory: (res) =>
          new DummyServiceContainer(res.resolve("DummyService")),
        lifecycle: "transient",
      },
    ]);

    resolver = new BaseServiceResolutionContext<TestServicesMap>(registry);
  });

  describe("resolve() method", () => {
    it("should return registered service instance", () => {
      expect(resolver.resolve("DummyService")).toBe(dummyServiceInstance);
    });

    it("should return registered service, created dynamically", () => {
      expect(resolver.resolve("TransientDummyService")).toBeInstanceOf(
        DummyService
      );
    });

    it("should always create new instance when service lifecycle is 'transient'", () => {
      const decoder1 = resolver.resolve("TransientDummyService");
      const decoder2 = resolver.resolve("TransientDummyService");
      expect(decoder1).toBeInstanceOf(DummyService);
      expect(decoder2).toBeInstanceOf(DummyService);
      expect(decoder2).not.toBe(decoder1);
    });

    it("should always return same instance when service lifecycle is 'singleton'", () => {
      const decoder1 = resolver.resolve("SingletonDummyService");
      const decoder2 = resolver.resolve("SingletonDummyService");
      expect(decoder1).toBeInstanceOf(DummyService);
      expect(decoder1).toBe(decoder2);
    });

    it("should always return same instance when service lifecycle is 'request'", () => {
      const decoder1 = resolver.resolve("RequestDummyService");
      const decoder2 = resolver.resolve("RequestDummyService");
      expect(decoder1).toBeInstanceOf(DummyService);
      expect(decoder1).toBe(decoder2);
    });

    it("should return different services for named registrations", () => {
      const transientDecoder = resolver.resolve("NamedDummyService"); // without name
      const singletonDecoder = resolver.resolve(
        "NamedDummyService",
        "Singleton"
      );
      const requestDecoder = resolver.resolve("NamedDummyService", "Request");

      expect(transientDecoder).toBeInstanceOf(DummyService);
      expect(singletonDecoder).toBeInstanceOf(DummyService);
      expect(requestDecoder).toBeInstanceOf(DummyService);
      expect(transientDecoder).not.toBe(singletonDecoder);
      expect(transientDecoder).not.toBe(requestDecoder);
      expect(requestDecoder).not.toBe(singletonDecoder);
    });

    it("should return same instance, when service is requested with same name, and lifecycle is 'singleton'", () => {
      const decoder = resolver.resolve("NamedDummyService", "Singleton");
      expect(resolver.resolve("NamedDummyService", "Singleton")).toBe(decoder);
    });

    it("should return same instance, when service is requested with same name, and lifecycle is 'request'", () => {
      const decoder = resolver.resolve("NamedDummyService", "Request");
      expect(resolver.resolve("NamedDummyService", "Request")).toBe(decoder);
    });

    it("should throw RangeError, when requested service is not registered", () => {
      expect(() => resolver.resolve("UnknownService")).toThrow(RangeError);
    });

    it("should throw RangeError, when requested named service is not registered", () => {
      expect(() =>
        resolver.resolve("NamedDummyService", "UnknownName")
      ).toThrow(RangeError);
    });

    it("should throw RangeError, when requesting service without name, but registered service is named", () => {
      expect(() => resolver.resolve("AlwaysNamedDummyService")).toThrow(
        RangeError
      );
    });

    it("should resolve services with dependencies", () => {
      const container = resolver.resolve("DummyServiceContainer");
      expect(container).toBeInstanceOf(DummyServiceContainer);
      expect(container.getDecoder()).toBeInstanceOf(DummyService);
    });

    it("should throw ServiceResolutionError, when error occur in service factory", () => {
      registry.set("SingletonDummyService", [
        {
          lifecycle: "singleton",
          name: "default",
          factory: () => {
            throw new Error("test error");
          },
        },
      ]);

      expect(() => resolver.resolve("SingletonDummyService")).toThrow(
        ServiceResolutionError
      );
    });
  });

  describe("has() method", () => {
    it("should return true, when registry has registered service instance", () => {
      expect(resolver.has("DummyService")).toBe(true);
    });

    it("should return true, when registry has registered service factory", () => {
      expect(resolver.has("TransientDummyService")).toBe(true);
    });

    it("should return true, when registry has registered named service", () => {
      expect(resolver.has("NamedDummyService", "Singleton")).toBe(true);
    });

    it("should return false, when registry has not requested service", () => {
      expect(resolver.has("NotRegistered")).toBe(false);
    });

    it("should return false, when registry has not service with given name", () => {
      expect(resolver.has("NamedDummyService", "NotRegisteredName")).toBe(
        false
      );
    });
  });

  describe("getStack() method", () => {
    it("should return empty array, unless is resolving service", () => {
      expect(resolver.getStack()).toEqual([]);
    });

    it("should return array with single record of service being resolved, when resolving root service", () => {
      registry.set("DummyService", [
        {
          name: "default",
          factory: (context) => {
            expect(context.getStack()).toEqual([
              { service: "DummyService", name: "default" },
            ]);
            return new DummyService();
          },
          lifecycle: "transient",
        },
      ]);

      resolver.resolve("DummyService");

      expect.hasAssertions();
    });

    it("should return array with all services being resolved, when resolving nested service", () => {
      registry.set("DummyService", [
        {
          name: "default",
          factory: (context) => {
            expect(context.getStack()).toEqual([
              { service: "DummyServiceContainer", name: "named" },
              { service: "DummyService", name: "default" },
            ]);
            return new DummyService();
          },
          lifecycle: "transient",
        },
      ]);
      registry.set("DummyServiceContainer", [
        {
          name: "named",
          factory: (context) => {
            expect(context.getStack()).toEqual([
              { service: "DummyServiceContainer", name: "named" },
            ]);
            return new DummyServiceContainer(context.resolve("DummyService"));
          },
          lifecycle: "transient",
        },
      ]);

      resolver.resolve("DummyServiceContainer", "named");

      expect(resolver.getStack()).toEqual([]);
    });
  });

  describe("isResolvingFor() method", () => {
    it("should return false, when nothing is being resolved", () => {
      expect(resolver.isResolvingFor("DummyService")).toBe(false);
      expect(resolver.isResolvingFor("NamedDummyService", "Singleton")).toBe(
        false
      );
    });

    it("should return true, when given service is somewhere in resolution stack", () => {
      registry.set("SingletonDummyService", [
        {
          name: "default",
          lifecycle: "singleton",
          factory: (context) => {
            expect(context.isResolvingFor("DummyService")).toBe(true);
            expect(context.isResolvingFor("DummyService", "default")).toBe(
              true
            );
            expect(context.isResolvingFor("DummyService", "notDefault")).toBe(
              false
            );
            expect(context.isResolvingFor("DummyServiceContainer")).toBe(true);
            expect(
              context.isResolvingFor("DummyServiceContainer", "default")
            ).toBe(true);
            expect(
              context.isResolvingFor("DummyServiceContainer", "notDefault")
            ).toBe(false);
            return new DummyService();
          },
        },
      ]);
      registry.set("DummyService", [
        {
          name: "default",
          lifecycle: "transient",
          factory: (context) => {
            context.resolve("SingletonDummyService"); // just call to execute expectations on deeper level of resolution
            return new DummyService();
          },
        },
      ]);

      resolver.resolve("DummyServiceContainer");

      expect.hasAssertions();
    });
  });

  describe("isDirectlyResolvingFor() method", () => {
    it("should return false, when nothing is being resolved", () => {
      expect(resolver.isDirectlyResolvingFor("DummyService")).toBe(false);
      expect(
        resolver.isDirectlyResolvingFor("NamedDummyService", "Singleton")
      ).toBe(false);
    });

    it("should return true, when requested service is previous in resolution stack and false otherwise", () => {
      registry.set("SingletonDummyService", [
        {
          name: "default",
          lifecycle: "singleton",
          factory: (context) => {
            expect(context.isDirectlyResolvingFor("DummyService")).toBe(true);
            expect(
              context.isDirectlyResolvingFor("DummyService", "default")
            ).toBe(true);
            expect(
              context.isDirectlyResolvingFor("DummyService", "notDefault")
            ).toBe(false);
            expect(
              context.isDirectlyResolvingFor("DummyServiceContainer")
            ).toBe(false);
            expect(
              context.isDirectlyResolvingFor("DummyServiceContainer", "default")
            ).toBe(false);
            expect(
              context.isDirectlyResolvingFor(
                "DummyServiceContainer",
                "notDefault"
              )
            ).toBe(false);
            return new DummyService();
          },
        },
      ]);
      registry.set("DummyService", [
        {
          name: "default",
          lifecycle: "transient",
          factory: (context) => {
            context.resolve("SingletonDummyService"); // just call to execute expectations on deeper level of resolution
            return new DummyService();
          },
        },
      ]);

      resolver.resolve("DummyServiceContainer");

      expect.hasAssertions();
    });
  });

  describe("resolveAll() method", () => {
    it("should return array of single element, when there is only one service registered", () => {
      expect(resolver.resolveAll("DummyService")).toEqual([
        dummyServiceInstance,
      ]);
    });

    it("should return array of all services, registered under given key by different names", () => {
      expect(resolver.resolveAll("NamedDummyService")).toEqual([
        expect.any(DummyService),
        expect.any(DummyService),
        expect.any(DummyService),
      ]);
    });

    it("should return empty array, when requested service is not registered", () => {
      expect(resolver.resolveAll("NotRegistered")).toEqual([]);
    });

    it("should throw ServiceResolutionError, when error occur in service factory", () => {
      const registrations = registry.get("NamedDummyService");
      registrations![2].factory = () => {
        throw new Error("Test error");
      };
      expect(() => resolver.resolveAll("NamedDummyService")).toThrow(
        ServiceResolutionError
      );
    });
  });

  describe("resolveTuple() method", () => {
    it("should resolve tuple of services by service keys", () => {
      const [service1, service2] = resolver.resolveTuple([
        "DummyService",
        "SingletonDummyService",
      ] as const);
      expect(service1).toBeInstanceOf(DummyService);
      expect(service2).toBeInstanceOf(DummyService);
    });

    it("should resolve tuple of services by NamedServiceRecord", () => {
      const [service1, service2] = resolver.resolveTuple([
        { service: "DummyService", name: "default" },
        { service: "DummyServiceContainer", name: "default" },
      ] as const);
      expect(service1).toBeInstanceOf(DummyService);
      expect(service2).toBeInstanceOf(DummyServiceContainer);
    });

    it("should resolve tuple of services in same request context", () => {
      const [service1, service2] = resolver.resolveTuple([
        { service: "NamedDummyService", name: "Request" },
        { service: "NamedDummyService", name: "Request" },
      ] as const);

      expect(service1).toBeInstanceOf(DummyService);
      expect(service2).toBeInstanceOf(DummyService);
      expect(service2).toBe(service1);
    });
  });
});
