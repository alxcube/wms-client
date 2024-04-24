import { beforeEach, describe, expect, it } from "vitest";
import { BaseVersionComparator } from "../../../src";

describe("BaseVersionComparator class", () => {
  let comparator: BaseVersionComparator;
  beforeEach(() => {
    comparator = new BaseVersionComparator();
  });

  describe("compare()", () => {
    it("should compare version strings correct", () => {
      expect(comparator.compare("2", "1")).toBe(1);
      expect(comparator.compare("2", "2")).toBe(0);
      expect(comparator.compare("1", "2")).toBe(-1);
      expect(comparator.compare("2.0", "1.0")).toBe(1);
      expect(comparator.compare("2.0", "2.0")).toBe(0);
      expect(comparator.compare("1.0", "2.0")).toBe(-1);
      expect(comparator.compare("2.0.0", "1.0.0")).toBe(1);
      expect(comparator.compare("2.0.0", "2.0.0")).toBe(0);
      expect(comparator.compare("1.0.0", "2.0.0")).toBe(-1);
      expect(comparator.compare("1.0", "1.0.1")).toBe(-1);
      expect(comparator.compare("1.1", "1.0.1")).toBe(1);
      expect(comparator.compare("2", "2.0.0")).toBe(0);
    });

    it("should compare with wildcard", () => {
      expect(comparator.compare("1.*.1", "1.1.1")).toBe(0);
      expect(comparator.compare("1.*.1", "1.2.1")).toBe(0);
    });
  });

  describe("is() method", () => {
    it("should return boolean result of comparsion, using given operator", () => {
      expect(comparator.is("1", "=", "1")).toBe(true);
      expect(comparator.is("1", "=", "1.0.0")).toBe(true);
      expect(comparator.is("1", "=", "2")).toBe(false);
      expect(comparator.is("1", "!=", "2")).toBe(true);
      expect(comparator.is("1", "!=", "1.0.0")).toBe(false);
      expect(comparator.is("1.0.1", ">", "1.0")).toBe(true);
      expect(comparator.is("1.0.1", ">", "1.0.1")).toBe(false);
      expect(comparator.is("1.0", "<", "1.0.1")).toBe(true);
      expect(comparator.is("1.0.1", "<", "1.0.1")).toBe(false);
      expect(comparator.is("1.0.1", ">=", "1.0.0")).toBe(true);
      expect(comparator.is("1.0.1", ">=", "1.0.1")).toBe(true);
      expect(comparator.is("1.0.1", ">=", "1.0.2")).toBe(false);
      expect(comparator.is("1.0.0", "<=", "1.0.1")).toBe(true);
      expect(comparator.is("1.0.1", "<=", "1.0.1")).toBe(true);
      expect(comparator.is("1.0.2", "<=", "1.0.1")).toBe(false);
    });
  });
});
