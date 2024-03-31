import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { MetadataUrl } from "../../../../wms-data-types/MetadataUrl";

export class LayerMetadataUrlsExtractorFactory
  implements SingleNodeDataExtractorFnFactory<MetadataUrl[] | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    MetadataUrl[] | undefined
  > {
    return map()
      .toNodesArray("MetadataURL")
      .asArray()
      .ofObjects({
        type: map().toNode("@type").mandatory().asString(),
        format: map().toNode("Format").mandatory().asString(),
        url: map().toNode("OnlineResource/@xlink:href").mandatory().asString(),
      })
      .createNodeDataExtractor();
  }
}
