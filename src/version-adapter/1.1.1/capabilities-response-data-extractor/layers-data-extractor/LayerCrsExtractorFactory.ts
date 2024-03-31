import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";

export class LayerCrsExtractorFactory
  implements SingleNodeDataExtractorFnFactory<string[] | undefined>
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
