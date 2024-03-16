import { beforeEach, describe, expect, it } from "vitest";
import { BaseServiceContainer } from "../../../src/service-container/BaseServiceContainer";
import { ServiceResolutionError } from "../../../src/service-container/ServiceResolutionError";

import type { ServicesMap } from "../../../src/service-container/ServiceResolver";

describe("BaseServiceContainer class", () => {
  class DummyService {}

  class DummyDependent {
    constructor(
      readonly dummyService1: DummyService,
      readonly dummyService2: DummyService
    ) {}
  }
  interface TestServicesMap extends ServicesMap {
    DummyService: DummyService;
    DummyDependent: DummyDependent;
  }

  let container: BaseServiceContainer<TestServicesMap>;
  let childContainer: BaseServiceContainer<TestServicesMap>;

  beforeEach(() => {
    container = new BaseServiceContainer();
    childContainer = container.createChild();
  });

  describe("registerService() method", () => {
    it("should register service instance", () => {
      const instance = new DummyService();
      container.registerService("DummyService", instance);
      expect(container.resolve("DummyService")).toBe(instance);
    });

    it("should register named service instance", () => {
      const instance = new DummyService();
      container.registerService("DummyService", instance, { name: "Named" });
      expect(container.resolve("DummyService", "Named")).toBe(instance);
    });

    it("should register multiple service instances under different names", () => {
      const instance1 = new DummyService();
      const instance2 = new DummyService();
      const instance3 = new DummyService();

      container.registerService("DummyService", instance1); // will be named 'default'
      container.registerService("DummyService", instance2, {
        name: "instance2",
      });
      container.registerService("DummyService", instance3, {
        name: "instance3",
      });

      expect(container.resolve("DummyService")).toBe(instance1);
      expect(container.resolve("DummyService", "default")).toBe(instance1);
      expect(container.resolve("DummyService", "instance2")).toBe(instance2);
      expect(container.resolve("DummyService", "instance3")).toBe(instance3);
    });

    it("should throw TypeError when trying to register service that already registered as default", () => {
      const instance = new DummyService();
      container.registerService("DummyService", instance);
      expect(() => container.registerService("DummyService", instance)).toThrow(
        TypeError
      );
    });

    it("should throw TypeError when trying to register named service under name, that is already taken", () => {
      const instance = new DummyService();
      const name = "TestServiceName";
      container.registerService("DummyService", instance, { name });
      expect(() =>
        container.registerService("DummyService", instance, { name })
      ).toThrow(TypeError);
    });

    it("should replace existing default service, when 'replace' option is set to true", () => {
      const instance1 = new DummyService();
      const instance2 = new DummyService();
      container.registerService("DummyService", instance1);
      expect(container.resolve("DummyService")).toBe(instance1);
      container.registerService("DummyService", instance2, { replace: true });
      expect(container.resolve("DummyService")).toBe(instance2);
    });

    it("should replace existing named service, when 'replace' option is set to true", () => {
      const instance1 = new DummyService();
      const instance2 = new DummyService();
      const name = "named";
      container.registerService("DummyService", instance1, { name });
      expect(container.resolve("DummyService", name)).toBe(instance1);
      container.registerService("DummyService", instance2, {
        name,
        replace: true,
      });
      expect(container.resolve("DummyService", name)).toBe(instance2);
    });

    it("should throw TypeError, when trying to register service instance after service factory was registered, using 'registerFactory()' method", () => {
      container.registerFactory("DummyService", () => new DummyService());
      expect(() =>
        container.registerService("DummyService", new DummyService())
      ).toThrow(TypeError);
    });

    it("should replace service factory registration, made earlier using 'registerFactory()' method", () => {
      const instance = new DummyService();
      container.registerFactory("DummyService", () => new DummyService());
      container.registerService("DummyService", instance, { replace: true });
      expect(container.resolve("DummyService")).toBe(instance);
    });
  });

  describe("registerFactory() method", () => {
    let instance1: DummyService;
    let instance2: DummyService;
    let factory1: () => DummyService;
    let factory2: () => DummyService;

    beforeEach(() => {
      instance1 = new DummyService();
      instance2 = new DummyService();
      factory1 = () => instance1;
      factory2 = () => instance2;
    });

    it("should register service factory", () => {
      container.registerFactory("DummyService", factory1);
      expect(container.resolve("DummyService")).toBe(instance1);
    });

    it("should register named service factory", () => {
      const name = "named";
      container.registerFactory("DummyService", factory1, { name });
      expect(container.resolve("DummyService", name)).toBe(instance1);
    });

    it("should register multiple service factories under different names", () => {
      container.registerFactory("DummyService", factory1, { name: "name1" });
      container.registerFactory("DummyService", factory2, { name: "name2" });
      container.registerFactory("DummyService", () => new DummyService()); // named "default"

      const service1 = container.resolve("DummyService", "name1");
      const service2 = container.resolve("DummyService", "name2");
      const service3 = container.resolve("DummyService");

      expect(service1).toBe(instance1);
      expect(service2).toBe(instance2);
      expect(service3).toBeInstanceOf(DummyService);
      expect(service3).not.toBe(instance1);
      expect(service3).not.toBe(instance2);
    });

    it("should register service factory with transient lifecycle by default", () => {
      container.registerFactory("DummyService", () => new DummyService());
      const service1 = container.resolve("DummyService");
      const service2 = container.resolve("DummyService");
      expect(service1).toBeInstanceOf(DummyService);
      expect(service2).toBeInstanceOf(DummyService);
      expect(service2).not.toBe(service1);
    });

    it("should register service factory with singleton lifecycle, when 'lifecycle' option is set to 'singleton'", () => {
      container.registerFactory("DummyService", () => new DummyService(), {
        lifecycle: "singleton",
      });
      const service1 = container.resolve("DummyService");
      const service2 = container.resolve("DummyService");
      expect(service2).toBe(service1);
    });

    it("should register service factory with request lifecycle, when 'lifecycle' option is set to 'request'", () => {
      container.registerFactory("DummyService", () => new DummyService(), {
        lifecycle: "request",
      });
      container.registerFactory(
        "DummyDependent",
        (resolver) =>
          new DummyDependent(
            resolver.resolve("DummyService"),
            resolver.resolve("DummyService")
          )
      );

      const service1 = container.resolve("DummyDependent");
      const service2 = container.resolve("DummyDependent");

      expect(service1).toBeInstanceOf(DummyDependent);
      expect(service1.dummyService1).toBeInstanceOf(DummyService);
      expect(service1.dummyService2).toBeInstanceOf(DummyService);
      expect(service1.dummyService1).toBe(service1.dummyService2);

      expect(service2).toBeInstanceOf(DummyDependent);
      expect(service2.dummyService1).toBeInstanceOf(DummyService);
      expect(service2.dummyService2).toBeInstanceOf(DummyService);
      expect(service2.dummyService1).toBe(service2.dummyService2);

      expect(service1.dummyService1).not.toBe(service2.dummyService1);
    });

    it("should throw TypeError, when trying to register default service factory, when it is already registered", () => {
      container.registerFactory("DummyService", () => new DummyService());
      expect(() =>
        container.registerFactory("DummyService", () => new DummyService())
      ).toThrow(TypeError);
    });

    it("should throw TypeError, when trying to register named service factory under name that is already taken", () => {
      const name = "named";
      const factory = () => new DummyService();
      container.registerFactory("DummyService", factory, { name });
      expect(() =>
        container.registerFactory("DummyService", factory, { name })
      ).toThrow(TypeError);
    });

    it("should replace existing default service factory, when 'replace' option is set to true", () => {
      container.registerFactory("DummyService", factory1);
      expect(container.resolve("DummyService")).toBe(instance1);
      container.registerFactory("DummyService", factory2, { replace: true });
      expect(container.resolve("DummyService")).toBe(instance2);
    });

    it("should replace existing named service factory, when 'replace' option is set to true", () => {
      const name = "named";
      container.registerFactory("DummyService", factory1, { name });
      expect(container.resolve("DummyService", name)).toBe(instance1);
      container.registerFactory("DummyService", factory2, {
        name,
        replace: true,
      });
      expect(container.resolve("DummyService", name)).toBe(instance2);
    });

    it("should change lifecycle, when replacing service factory", () => {
      const factory = () => new DummyService();
      container.registerFactory("DummyService", factory, {
        lifecycle: "singleton",
      });
      const instance1 = container.resolve("DummyService");
      expect(container.resolve("DummyService")).toBe(instance1);

      container.registerFactory("DummyService", factory, { replace: true }); // transient lifecycle by default
      const instance2 = container.resolve("DummyService");
      expect(instance2).not.toBe(instance1);
      expect(container.resolve("DummyService")).not.toBe(instance2);
    });

    it("should throw TypeError, when trying to register factory after service instance was registered, using 'registerService()' method", () => {
      container.registerService("DummyService", instance1);
      expect(() => container.registerFactory("DummyService", factory1)).toThrow(
        TypeError
      );
    });

    it("should replace service instance registration, made using 'registerService()' method", () => {
      container.registerService("DummyService", instance1);
      expect(container.resolve("DummyService")).toBe(instance1);
      container.registerFactory("DummyService", () => new DummyService(), {
        replace: true,
      });
      expect(container.resolve("DummyService")).not.toBe(instance1);
    });
  });

  describe("resolve() method", () => {
    let dummyServiceInstance: DummyService;
    beforeEach(() => {
      dummyServiceInstance = new DummyService();
      container.registerService("DummyService", dummyServiceInstance);
      container.registerFactory("DummyService", () => new DummyService(), {
        name: "dynamic",
      });
      container.registerFactory("DummyDependent", (context) => {
        return new DummyDependent(
          context.resolve("DummyService"),
          context.resolve("DummyService", "dynamic")
        );
      });
    });

    it("should resolve service instance", () => {
      expect(container.resolve("DummyService")).toBe(dummyServiceInstance);
    });

    it("should resolve service, created by factory", () => {
      expect(container.resolve("DummyService", "dynamic")).toBeInstanceOf(
        DummyService
      );
    });

    it("should resolve service with dependencies", () => {
      const dependent = container.resolve("DummyDependent");
      expect(dependent).toBeInstanceOf(DummyDependent);
      expect(dependent.dummyService1).toBe(dummyServiceInstance);
      expect(dependent.dummyService2).toBeInstanceOf(DummyService);
    });

    it("should throw RangeError, when requested service is not registered", () => {
      expect(() => container.resolve("NotRegistered")).toThrow(RangeError);
    });

    it("should throw RangeError, when requested named service is not registered", () => {
      expect(() =>
        container.resolve("DummyService", "not-registered-name")
      ).toThrow(RangeError);
    });

    it("should throw ServiceResolutionError, when error occurs in service factory", () => {
      container.registerFactory(
        "DummyService",
        () => {
          throw "test error";
        },
        { replace: true }
      );

      expect(() => container.resolve("DummyService")).toThrow(
        ServiceResolutionError
      );
    });

    it("should resolve service from parent container in child container", () => {
      expect(childContainer.resolve("DummyService")).toBe(dummyServiceInstance);
    });

    it("should resolve own service, when it is registered, ignoring service in parent container", () => {
      const childDummyInstance = new DummyService();
      childContainer.registerService("DummyService", childDummyInstance);
      expect(container.resolve("DummyService")).toBe(dummyServiceInstance);
      expect(childContainer.resolve("DummyService")).toBe(childDummyInstance);
      // this is resolved from parent container
      expect(childContainer.resolve("DummyService", "dynamic")).toBeInstanceOf(
        DummyService
      );
    });

    it("should resolve own services, when no such services is registered in parent container", () => {
      container.unregister("DummyDependent");
      childContainer.registerFactory("DummyDependent", (context) => {
        return new DummyDependent(
          context.resolve("DummyService"),
          context.resolve("DummyService")
        );
      });
      expect(childContainer.resolve("DummyDependent")).toBeInstanceOf(
        DummyDependent
      );
      expect(() => container.resolve("DummyDependent")).toThrow(RangeError);
    });
  });

  describe("resolveAll() method", () => {
    let dummyServiceInstance: DummyService;
    beforeEach(() => {
      dummyServiceInstance = new DummyService();
      container.registerService("DummyService", dummyServiceInstance);
      container.registerFactory("DummyService", () => new DummyService(), {
        name: "dynamic",
      });
    });

    it("should resolve all registered services under given key", () => {
      expect(container.resolveAll("DummyService")).toEqual([
        dummyServiceInstance,
        expect.any(DummyService),
      ]);
    });

    it("should return empty array, when no services registered under given key", () => {
      expect(container.resolveAll("NotRegistered")).toEqual([]);
    });

    it("should resolve services from parent container, when child container has no registered services by given key", () => {
      expect(childContainer.resolveAll("DummyService")).toEqual([
        dummyServiceInstance,
        expect.any(DummyService),
      ]);
    });

    it("should resolve services from current container instead of parent, when current container has own registrations of such services", () => {
      const childDummyService = new DummyService();
      childContainer.registerService("DummyService", childDummyService);
      expect(container.resolveAll("DummyService")).toEqual([
        dummyServiceInstance,
        expect.any(DummyService),
      ]);
      expect(childContainer.resolveAll("DummyService")).toEqual([
        childDummyService,
        expect.any(DummyService),
      ]);
    });

    it("should resolve services from parent container and from current container", () => {
      const dummyService = new DummyService();
      childContainer.registerService("DummyService", dummyService, {
        name: "child",
      });
      expect(childContainer.resolveAll("DummyService")).toEqual([
        dummyServiceInstance,
        expect.any(DummyService),
        dummyService,
      ]);
    });
  });

  describe("resolveTuple() method", () => {
    beforeEach(() => {
      container.registerFactory("DummyService", () => new DummyService(), {
        lifecycle: "request",
      });
    });

    it("should resolve tuple of services in single request context", () => {
      const service1 = container.resolve("DummyService");
      const service2 = container.resolve("DummyService");
      const [service3, service4] = container.resolveTuple([
        "DummyService",
        "DummyService",
      ] as const);
      expect(service1).not.toBe(service2);
      expect(service3).toBe(service4);
    });

    it("should resolve tuple of services in single request context from parent container", () => {
      const [service1, service2] = childContainer.resolveTuple([
        "DummyService",
        "DummyService",
      ] as const);
      expect(service2).toBe(service1);
    });
  });

  describe("unregister() method", () => {
    beforeEach(() => {
      container.registerService("DummyService", new DummyService());
      container.registerFactory("DummyService", () => new DummyService(), {
        name: "dynamic",
      });
      container.registerFactory("DummyDependent", (resolver) => {
        return new DummyDependent(
          resolver.resolve("DummyService"),
          resolver.resolve("DummyService", "dynamic")
        );
      });
    });

    it("should unregister all services, when name is not passed", () => {
      expect(container.resolve("DummyService")).toBeInstanceOf(DummyService);
      expect(container.resolve("DummyService", "dynamic")).toBeInstanceOf(
        DummyService
      );
      container.unregister("DummyService");
      expect(() => container.resolve("DummyService")).toThrow(RangeError);
      expect(() => container.resolve("DummyService", "dynamic")).toThrow(
        RangeError
      );
    });

    it("should unregister only named service, when name is given", () => {
      expect(container.resolve("DummyService")).toBeInstanceOf(DummyService);
      expect(container.resolve("DummyService", "dynamic")).toBeInstanceOf(
        DummyService
      );

      container.unregister("DummyService", "default");
      expect(() => container.resolve("DummyService")).toThrow(RangeError);
      expect(container.resolve("DummyService", "dynamic")).toBeInstanceOf(
        DummyService
      );

      container.unregister("DummyService", "dynamic");
      expect(() => container.resolve("DummyService", "dynamic")).toThrow(
        RangeError
      );
    });

    it("should unregister services in parent container, when 'cascade' argument is set to true", () => {
      expect(childContainer.resolve("DummyService")).toBeInstanceOf(
        DummyService
      );
      expect(container.resolve("DummyService")).toBeInstanceOf(DummyService);

      childContainer.unregister("DummyService");

      expect(childContainer.resolve("DummyService")).toBeInstanceOf(
        DummyService
      );
      expect(container.resolve("DummyService")).toBeInstanceOf(DummyService);

      childContainer.unregister("DummyService", undefined, true);

      expect(() => childContainer.resolve("DummyService")).toThrow(RangeError);
      expect(() => container.resolve("DummyService")).toThrow(RangeError);
    });
  });

  describe("has() method", () => {
    it("should return true, when container has registered service instance, and false otherwise", () => {
      expect(container.has("DummyService")).toBe(false);
      expect(container.has("DummyService", "default")).toBe(false);
      expect(container.has("DummyService", "named")).toBe(false);

      container.registerService("DummyService", new DummyService(), {
        name: "named",
      });

      expect(container.has("DummyService")).toBe(true);
      expect(container.has("DummyService", "default")).toBe(false);
      expect(container.has("DummyService", "named")).toBe(true);

      container.registerService("DummyService", new DummyService());

      expect(container.has("DummyService")).toBe(true);
      expect(container.has("DummyService", "default")).toBe(true);
      expect(container.has("DummyService", "named")).toBe(true);

      container.unregister("DummyService", "named");

      expect(container.has("DummyService")).toBe(true);
      expect(container.has("DummyService", "default")).toBe(true);
      expect(container.has("DummyService", "named")).toBe(false);
    });

    it("should return true, when container has registered service factory, and false otherwise", () => {
      const factory = () => new DummyService();

      expect(container.has("DummyService")).toBe(false);
      expect(container.has("DummyService", "default")).toBe(false);
      expect(container.has("DummyService", "named")).toBe(false);

      container.registerFactory("DummyService", factory, {
        name: "named",
      });

      expect(container.has("DummyService")).toBe(true);
      expect(container.has("DummyService", "default")).toBe(false);
      expect(container.has("DummyService", "named")).toBe(true);

      container.registerFactory("DummyService", factory);

      expect(container.has("DummyService")).toBe(true);
      expect(container.has("DummyService", "default")).toBe(true);
      expect(container.has("DummyService", "named")).toBe(true);

      container.unregister("DummyService", "named");

      expect(container.has("DummyService")).toBe(true);
      expect(container.has("DummyService", "default")).toBe(true);
      expect(container.has("DummyService", "named")).toBe(false);
    });

    it("should return true, if child container has not registered service, but parent container has", () => {
      expect(childContainer.has("DummyService")).toBe(false);
      expect(childContainer.has("DummyService", "default")).toBe(false);
      expect(childContainer.has("DummyService", "named")).toBe(false);

      container.registerService("DummyService", new DummyService(), {
        name: "named",
      });

      expect(childContainer.has("DummyService")).toBe(true);
      expect(childContainer.has("DummyService", "default")).toBe(false);
      expect(childContainer.has("DummyService", "named")).toBe(true);

      container.registerService("DummyService", new DummyService());

      expect(childContainer.has("DummyService")).toBe(true);
      expect(childContainer.has("DummyService", "default")).toBe(true);
      expect(childContainer.has("DummyService", "named")).toBe(true);

      container.unregister("DummyService", "named");

      expect(childContainer.has("DummyService")).toBe(true);
      expect(childContainer.has("DummyService", "default")).toBe(true);
      expect(childContainer.has("DummyService", "named")).toBe(false);
    });
  });

  describe("hasOwn() method", () => {
    it("should return true, when container has registered service in it's own storage and false otherwise", () => {
      container.registerFactory("DummyService", () => new DummyService());
      childContainer.registerFactory("DummyService", () => new DummyService());

      expect(container.has("DummyService")).toBe(true);
      expect(childContainer.has("DummyService")).toBe(true);
      expect(container.hasOwn("DummyService")).toBe(true);
      expect(childContainer.hasOwn("DummyService")).toBe(true);

      childContainer.unregister("DummyService");

      expect(container.has("DummyService")).toBe(true);
      expect(childContainer.has("DummyService")).toBe(true);
      expect(container.hasOwn("DummyService")).toBe(true);
      expect(childContainer.hasOwn("DummyService")).toBe(false);
    });
  });

  describe("createChild() method", () => {
    it("should return new instance of BaseServiceContainer", () => {
      const child = container.createChild();
      expect(child).toBeInstanceOf(BaseServiceContainer);
      expect(child).not.toBe(container);
    });
  });

  describe("getParent() method", () => {
    it("should return parent container", () => {
      expect(childContainer.getParent()).toBe(container);
    });

    it("should return undefined, when container has no parent", () => {
      expect(container.getParent()).toBeUndefined();
    });
  });

  describe("backup() and restore() methods", () => {
    let dummyServiceInstance: DummyService;
    beforeEach(() => {
      dummyServiceInstance = new DummyService();
      container.registerService("DummyService", dummyServiceInstance);
      container.registerFactory("DummyDependent", (context) => {
        return new DummyDependent(
          context.resolve("DummyService"),
          context.resolve("DummyService")
        );
      });
    });

    it("should backup and restore service registrations", () => {
      const dummyServiceOverride = new DummyService();

      expect(container.resolve("DummyService")).toBe(dummyServiceInstance);

      container.backup();
      container.registerService("DummyService", dummyServiceOverride, {
        replace: true,
      });
      expect(container.resolve("DummyService")).toBe(dummyServiceOverride);

      container.restore();
      expect(container.resolve("DummyService")).toBe(dummyServiceInstance);
    });

    it("should backup and restore only own registrations, unless 'cascade' argument is set to true", () => {
      const dummyServiceOverride = new DummyService();
      const childDummyService = new DummyService();
      childContainer.registerService("DummyService", childDummyService);

      expect(container.resolve("DummyService")).toBe(dummyServiceInstance);
      expect(childContainer.resolve("DummyService")).toBe(childDummyService);

      childContainer.backup();
      container.registerService("DummyService", dummyServiceOverride, {
        replace: true,
      });
      childContainer.registerService("DummyService", dummyServiceOverride, {
        replace: true,
      });

      expect(container.resolve("DummyService")).toBe(dummyServiceOverride);
      expect(childContainer.resolve("DummyService")).toBe(dummyServiceOverride);

      childContainer.restore();
      expect(container.resolve("DummyService")).toBe(dummyServiceOverride);
      expect(childContainer.resolve("DummyService")).toBe(childDummyService);
    });

    it("should backup and restore registrations in parent container too, when 'cascade' argument is set to true", () => {
      const dummyServiceOverride = new DummyService();
      const childDummyService = new DummyService();
      childContainer.registerService("DummyService", childDummyService);

      expect(container.resolve("DummyService")).toBe(dummyServiceInstance);
      expect(childContainer.resolve("DummyService")).toBe(childDummyService);

      childContainer.backup(true);
      container.registerService("DummyService", dummyServiceOverride, {
        replace: true,
      });
      childContainer.registerService("DummyService", dummyServiceOverride, {
        replace: true,
      });

      expect(container.resolve("DummyService")).toBe(dummyServiceOverride);
      expect(childContainer.resolve("DummyService")).toBe(dummyServiceOverride);

      childContainer.restore(true);
      expect(container.resolve("DummyService")).toBe(dummyServiceInstance);
      expect(childContainer.resolve("DummyService")).toBe(childDummyService);
    });
  });
});
