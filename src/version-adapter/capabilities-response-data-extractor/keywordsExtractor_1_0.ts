import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { Keyword } from "../../wms-data-types/get-capabilities-response/Keyword";

export const keywordsExtractor_1_0: SingleNodeDataExtractorFn<
  Keyword[] | undefined
> = map()
  .toNode("Keywords")
  .asString()
  .withConversion((keywordsString) => {
    return keywordsString
      .trim()
      .split(/\s+/)
      .map((keyword) => ({ value: keyword }));
  })
  .createNodeDataExtractor();
