import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../../error";

/**
 * Data extractor for ExceptionFormat. Compatible with WMS 1.3.
 */
export const exceptionFormatExtractor_1_3: SingleNodeDataExtractorFn<
  ExceptionFormat[]
> = map()
  .toNodesArray("wms:Exception/wms:Format")
  .mandatory()
  .asArray()
  .ofStrings()
  .withConversion((formats) => {
    return formats as ExceptionFormat[];
  })
  .createNodeDataExtractor();
