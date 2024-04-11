import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Layer } from "../../../wms-data-types/Layer";

export class CrsExtractor
  implements SingleNodeDataExtractorFnFactory<Layer["crs"]>
{
  constructor(private readonly crsNodeName: string) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<string[] | undefined> {
    return map()
      .toNodesArray(this.crsNodeName)
      .asArray()
      .ofStrings()
      .withConversion((crses) => {
        // Handle case whe multiple CRS defined in single node, delimited by whitespaces.
        return crses.flatMap((crs) => crs.trim().split(/\s+/));
      })
      .createNodeDataExtractor();
  }
}
