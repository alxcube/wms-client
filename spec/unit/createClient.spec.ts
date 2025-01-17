import axios from "axios";
import { describe, expect, it } from "vitest";
import { BaseWmsClient, createClient } from "../../src";

describe("createClient() function", () => {
  it("should create BaseWmsClient instance", () => {
    expect(createClient("https://example.com", "1.3.0")).toBeInstanceOf(
      BaseWmsClient
    );
  });

  it("should throw RangeError, when not supported WMS version passed", () => {
    expect(() => createClient("", "100")).toThrow(RangeError);
  });

  it("should use passed AxiosInstance", () => {
    const httpClient = axios.create();
    expect(createClient("", "1.3.0", { httpClient }).getHttpClient()).toBe(
      httpClient
    );
  });
});
