import { beforeEach, describe, expect, it } from "vitest";
import xpath from "xpath";
import { keywordsExtractor_1_0 } from "../../../../src";
import { testContainer } from "../../../testContainer";

describe("keywordsExtractor_1_0() function", () => {
  const xml = "<Root><Keywords>kw1 kw2  kw3</Keywords></Root>";
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

  it("should extract Keyword objects array from context node of wms xml v1.0.0", () => {
    expect(keywordsExtractor_1_0(contextNode, xpath.select)).toEqual([
      { value: "kw1" },
      { value: "kw2" },
      { value: "kw3" },
    ]);
  });
});
