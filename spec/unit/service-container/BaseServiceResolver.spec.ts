import { beforeEach, describe, expect, it } from "vitest";
import {
  BaseServiceResolver,
  type ServiceRegistration,
} from "../../../src/service-container/BaseServiceResolver";
import type { ServicesMap } from "../../../src/service-container/ServiceContainer";

describe("BaseServiceResolver class", () => {
  class DummyTextDecoderContainer {
    constructor(private readonly textDecoder: TextDecoder) {}

    getDecoder(): TextDecoder {
      return this.textDecoder;
    }
  }
  interface TestServicesMap extends ServicesMap {
    TextDecoder: TextDecoder;
    TransientTextDecoder: TextDecoder;
    SingletonTextDecoder: TextDecoder;
    RequestTextDecoder: TextDecoder;
    NamedTextDecoder: TextDecoder;
    AlwaysNamedTextDecoder: TextDecoder;
    DummyTextDecoderContainer: DummyTextDecoderContainer;
  }

  let textDecoderInstance: TextDecoder;
  let registry: Map<
    keyof TestServicesMap,
    ServiceRegistration<TestServicesMap, unknown>[]
  >;
  let resolver: BaseServiceResolver<TestServicesMap>;

  beforeEach(() => {
    textDecoderInstance = new TextDecoder();
    const textDecoderFactory = () => new TextDecoder();
    registry = new Map();
    registry.set("TextDecoder", [
      {
        instance: textDecoderInstance,
        lifecycle: "singleton",
      },
    ]);
    registry.set("TransientTextDecoder", [
      { factory: textDecoderFactory, lifecycle: "transient" },
    ]);
    registry.set("SingletonTextDecoder", [
      { factory: textDecoderFactory, lifecycle: "singleton" },
    ]);
    registry.set("RequestTextDecoder", [
      { factory: textDecoderFactory, lifecycle: "request" },
    ]);
    registry.set("NamedTextDecoder", [
      { factory: textDecoderFactory, lifecycle: "transient" },
      {
        factory: textDecoderFactory,
        lifecycle: "singleton",
        name: "Singleton",
      },
      {
        factory: textDecoderFactory,
        lifecycle: "request",
        name: "Request",
      },
    ]);
    registry.set("AlwaysNamedTextDecoder", [
      { name: "name", factory: textDecoderFactory, lifecycle: "singleton" },
    ]);
    registry.set("DummyTextDecoderContainer", [
      {
        factory: (res) =>
          new DummyTextDecoderContainer(res.resolve("TextDecoder")),
        lifecycle: "transient",
      },
    ]);

    resolver = new BaseServiceResolver<TestServicesMap>(registry);
  });

  describe("resolve() method", () => {
    it("should return registered service instance", () => {
      expect(resolver.resolve("TextDecoder")).toBe(textDecoderInstance);
    });

    it("should return registered service, created dynamically", () => {
      expect(resolver.resolve("TransientTextDecoder")).toBeInstanceOf(
        TextDecoder
      );
    });

    it("should always create new instance when service lifecycle is 'transient'", () => {
      const decoder1 = resolver.resolve("TransientTextDecoder");
      const decoder2 = resolver.resolve("TransientTextDecoder");
      expect(decoder1).toBeInstanceOf(TextDecoder);
      expect(decoder2).toBeInstanceOf(TextDecoder);
      expect(decoder2).not.toBe(decoder1);
    });

    it("should always return same instance when service lifecycle is 'singleton'", () => {
      const decoder1 = resolver.resolve("SingletonTextDecoder");
      const decoder2 = resolver.resolve("SingletonTextDecoder");
      expect(decoder1).toBeInstanceOf(TextDecoder);
      expect(decoder1).toBe(decoder2);
    });

    it("should always return same instance when service lifecycle is 'request'", () => {
      const decoder1 = resolver.resolve("RequestTextDecoder");
      const decoder2 = resolver.resolve("RequestTextDecoder");
      expect(decoder1).toBeInstanceOf(TextDecoder);
      expect(decoder1).toBe(decoder2);
    });

    it("should return different services for named registrations", () => {
      const transientDecoder = resolver.resolve("NamedTextDecoder"); // without name
      const singletonDecoder = resolver.resolve(
        "NamedTextDecoder",
        "Singleton"
      );
      const requestDecoder = resolver.resolve("NamedTextDecoder", "Request");

      expect(transientDecoder).toBeInstanceOf(TextDecoder);
      expect(singletonDecoder).toBeInstanceOf(TextDecoder);
      expect(requestDecoder).toBeInstanceOf(TextDecoder);
      expect(transientDecoder).not.toBe(singletonDecoder);
      expect(transientDecoder).not.toBe(requestDecoder);
      expect(requestDecoder).not.toBe(singletonDecoder);
    });

    it("should return same instance, when service is requested with same name, and lifecycle is 'singleton'", () => {
      const decoder = resolver.resolve("NamedTextDecoder", "Singleton");
      expect(resolver.resolve("NamedTextDecoder", "Singleton")).toBe(decoder);
    });

    it("should return same instance, when service is requested with same name, and lifecycle is 'request'", () => {
      const decoder = resolver.resolve("NamedTextDecoder", "Request");
      expect(resolver.resolve("NamedTextDecoder", "Request")).toBe(decoder);
    });

    it("should throw RangeError, when requested service is not registered", () => {
      expect(() => resolver.resolve("UnknownService")).toThrow(RangeError);
    });

    it("should throw RangeError, when requested named service is not registered", () => {
      expect(() => resolver.resolve("NamedTextDecoder", "UnknownName")).toThrow(
        RangeError
      );
    });

    it("should throw RangeError, when requesting service without name, but registered service is named", () => {
      expect(() => resolver.resolve("AlwaysNamedTextDecoder")).toThrow(
        RangeError
      );
    });

    it("should resolve services with dependencies", () => {
      const container = resolver.resolve("DummyTextDecoderContainer");
      expect(container).toBeInstanceOf(DummyTextDecoderContainer);
      expect(container.getDecoder()).toBeInstanceOf(TextDecoder);
    });
  });
});
