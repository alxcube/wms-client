import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Layer } from "../data-types";

/**
 * Layer CRS data extractor.
 */
export class CrsExtractor
  implements SingleNodeDataExtractorFnFactory<Layer["crs"]>
{
  /**
   * CrsExtractor constructor.
   *
   * @param crsNodeName
   */
  constructor(private readonly crsNodeName: string) {}

  /**
   * @inheritdoc
   */
  createNodeDataExtractor(): SingleNodeDataExtractorFn<string[] | undefined> {
    return map()
      .toNodesArray(this.crsNodeName)
      .asArray()
      .ofStrings()
      .withConversion((crses) => {
        // Handle case when multiple CRS defined in single node, delimited by whitespaces.
        return crses.flatMap((crs) => crs.trim().split(/\s+/));
      })
      .createNodeDataExtractor();
  }
}
