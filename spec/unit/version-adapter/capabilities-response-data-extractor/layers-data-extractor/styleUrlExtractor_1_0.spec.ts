import { beforeEach, describe, expect, it } from "vitest";
import xpath from "xpath";
import { styleUrlExtractor_1_0 } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/styleUrlExtractor_1_0";
import { testContainer } from "../../../../testContainer";

describe("styleUrlExtractor_1_0() function", () => {
  const xml = `<Root><StyleURL>http://test.url/</StyleURL></Root>`;
  let xmlParser: DOMParser;
  let contextNode: Element;

  beforeEach(() => {
    xmlParser = testContainer.resolve("DOMParser");
    contextNode = xpath.select(
      "/Root",
      xmlParser.parseFromString(xml, "text/xml"),
      true
    ) as Element;
  });

  it("should extract Layer['styles'][number]['styleUrl'] object from xml v1.0.0", () => {
    expect(styleUrlExtractor_1_0(contextNode, xpath.select)).toEqual({
      format: "",
      url: "http://test.url/",
    });
  });
});
