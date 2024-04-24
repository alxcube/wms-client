import { beforeEach, describe, expect, it } from "vitest";
import { BaseXmlResponseVersionExtractor } from "../../../../src/version-adapter";
import { testContainer } from "../../../testContainer";

describe("BaseXmlResponseVersionExtractor class", () => {
  let extractor: BaseXmlResponseVersionExtractor;
  let xmlParser: DOMParser;

  beforeEach(() => {
    extractor = testContainer.instantiate(BaseXmlResponseVersionExtractor, []);
    xmlParser = testContainer.resolve("DOMParser");
  });

  describe("extractVersion() method", () => {
    it("should return 'version' attribute value of root node", () => {
      expect(
        extractor.extractVersion(
          xmlParser.parseFromString("<Root version='1'></Root>", "text/xml")
        )
      ).toBe("1");

      expect(
        extractor.extractVersion(
          xmlParser.parseFromString("<Root version='1.0'></Root>", "text/xml")
        )
      ).toBe("1.0");

      expect(
        extractor.extractVersion(
          xmlParser.parseFromString("<Root version='1.0.1'></Root>", "text/xml")
        )
      ).toBe("1.0.1");
    });

    it("should throw TypeError, when there is no 'version' attribute", () => {
      expect(() =>
        extractor.extractVersion(
          xmlParser.parseFromString("<Root></Root>", "text/xml")
        )
      ).toThrow(TypeError);
    });

    it("should throw TypeError, when 'version' attribute value has invalid format", () => {
      expect(() =>
        extractor.extractVersion(
          xmlParser.parseFromString(
            "<Root version='v1.0.0'></Root>",
            "text/xml"
          )
        )
      ).toThrow(TypeError);
    });
  });
});
