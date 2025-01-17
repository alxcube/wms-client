import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../../error";

/**
 * Data extractor for ExceptionFormat. Compatible with WMS 1.1.
 */
export const exceptionFormatExtractor_1_1: SingleNodeDataExtractorFn<
  ExceptionFormat[]
> = map()
  .toNodesArray("Exception/Format")
  .mandatory()
  .asArray()
  .ofStrings()
  .withConversion((formats) =>
    formats.map((format) => {
      switch (format) {
        case "application/vnd.ogc.se_xml":
          return "XML";
        case "application/vnd.ogc.se_inimage":
          return "INIMAGE";
        case "application/vnd.ogc.se_blank":
          return "BLANK";
        default:
          return format as ExceptionFormat;
      }
    })
  )
  .createNodeDataExtractor();
