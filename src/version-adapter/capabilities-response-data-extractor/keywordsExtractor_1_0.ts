import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { Keyword } from "./data-types";

/**
 * `Keyword` objects array extractor, compatible with WMS 1.0.
 */
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
