import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../../wms-data-types/ExceptionFormat";

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
