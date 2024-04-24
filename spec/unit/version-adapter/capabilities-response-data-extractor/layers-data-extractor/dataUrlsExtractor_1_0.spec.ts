import { beforeEach, describe, expect, it } from "vitest";
import xpath from "xpath";
import { dataUrlsExtractor_1_0 } from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("dataUrlsExtractor_1_0() function", () => {
  const xml = `<Root><DataURL>http://test.url/</DataURL><DataURL>http://test2.url/</DataURL></Root>`;
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

  it("should extract Layer['dataUrls'] objects array from xml v1.0.0", () => {
    expect(dataUrlsExtractor_1_0(contextNode, xpath.select)).toEqual([
      {
        format: "",
        url: "http://test.url/",
      },
      {
        format: "",
        url: "http://test2.url/",
      },
    ]);
  });
});
