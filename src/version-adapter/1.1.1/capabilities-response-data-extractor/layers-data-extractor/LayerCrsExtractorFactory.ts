import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Layer } from "../../../../wms-data-types/Layer";

export class LayerCrsExtractorFactory
  implements SingleNodeDataExtractorFnFactory<Layer["crs"]>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<string[] | undefined> {
    return map()
      .toNodesArray("SRS")
      .asArray()
      .ofStrings()
      .withConversion((crses) => {
        // Handle case whe multiple CRS defined in single node, delimited by whitespaces.
        return crses.flatMap((crs) => crs.trim().split(/\s+/));
      })
      .createNodeDataExtractor();
  }
}
