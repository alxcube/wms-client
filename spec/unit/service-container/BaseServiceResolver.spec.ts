import { beforeEach, describe, expect, it } from "vitest";
import {
  BaseServiceResolver,
  type ServiceRegistration,
} from "../../../src/service-container/BaseServiceResolver";
import type { ServicesMap } from "../../../src/service-container/ServiceContainer";

describe("BaseServiceResolver class", () => {
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

  let DummyServiceInstance: DummyService;
  let registry: Map<
    keyof TestServicesMap,
    ServiceRegistration<TestServicesMap, unknown>[]
  >;
  let resolver: BaseServiceResolver<TestServicesMap>;

  beforeEach(() => {
    DummyServiceInstance = new DummyService();
    const DummyServiceFactory = () => new DummyService();
    registry = new Map();
    registry.set("DummyService", [
      {
        name: "default",
        instance: DummyServiceInstance,
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

    resolver = new BaseServiceResolver<TestServicesMap>(registry);
  });

  describe("resolve() method", () => {
    it("should return registered service instance", () => {
      expect(resolver.resolve("DummyService")).toBe(DummyServiceInstance);
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
  });
});
