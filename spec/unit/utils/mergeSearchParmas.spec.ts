import { describe, expect, it } from "vitest";
import { mergeSearchParams } from "../../../src";

describe("mergeSearchParams() function", () => {
  it("should merge search params of url with given params string", () => {
    const url = "http://test.com/?param1=value1";
    const query = "param2=value2";
    expect(mergeSearchParams(url, query)).toBe(
      "http://test.com/?param1=value1&param2=value2"
    );
  });

  it("should keep existing search params, unless `replace` option is set to true", () => {
    const url = "http://test.com/?param1=value1";
    const query = "param1=value2";
    expect(mergeSearchParams(url, query)).toBe(
      "http://test.com/?param1=value1"
    );
  });

  it("should replace existing search params, when `replace` option is set to true", () => {
    const url = "http://test.com/?param1=value1";
    const query = "param1=value2";
    expect(mergeSearchParams(url, query, { replace: true })).toBe(
      "http://test.com/?param1=value2"
    );
  });

  it("should accept empty query string", () => {
    const url = "http://test.com/";
    expect(mergeSearchParams(url, "")).toBe(url);
    expect(mergeSearchParams(url, "?")).toBe(url);
  });
});
