import { beforeEach, describe, expect, it } from "vitest";
import { BaseServiceContainer } from "../../../src/service-container/BaseServiceContainer";
import type { ServicesMap } from "../../../src/service-container/ServiceContainer";

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

  beforeEach(() => {
    container = new BaseServiceContainer();
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
  });
});
