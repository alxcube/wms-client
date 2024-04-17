import { beforeEach, describe, expect, it } from "vitest";
import { constant } from "../../../../src/service-container/constant";
import { RangeVersionCompatibilityChecker } from "../../../../src/version-adapter/version-compatibility-checker/RangeVersionCompatibilityChecker";
import { testContainer } from "../../../testContainer";

describe("RangeVersionCompatibilityChecker class", () => {
  let checker_1_1: RangeVersionCompatibilityChecker;
  let checker_1_3: RangeVersionCompatibilityChecker;

  beforeEach(() => {
    checker_1_1 = testContainer.instantiate(RangeVersionCompatibilityChecker, [
      "VersionComparator",
      constant("1.1"),
      constant("1.2"),
    ]);
    checker_1_3 = testContainer.instantiate(RangeVersionCompatibilityChecker, [
      "VersionComparator",
      constant("1.3"),
      constant("1.4"),
    ]);
  });

  describe("isCompatible() method", () => {
    it("should return true, if given version is within range [minVersion; maxVersion)", () => {
      expect(checker_1_1.isCompatible("1.1.0")).toBe(true);
      expect(checker_1_1.isCompatible("1.1.1")).toBe(true);
      expect(checker_1_1.isCompatible("1.1.99")).toBe(true);
      expect(checker_1_1.isCompatible("1.2.0")).toBe(false);
      expect(checker_1_1.isCompatible("1.0.99")).toBe(false);

      expect(checker_1_3.isCompatible("1.3.0")).toBe(true);
      expect(checker_1_3.isCompatible("1.3.99")).toBe(true);
      expect(checker_1_3.isCompatible("1.2.99")).toBe(false);
      expect(checker_1_3.isCompatible("1.4.0")).toBe(false);
    });
  });
});
