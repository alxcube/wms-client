import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils/withNamespace";
import type { MetadataUrl } from "../../../wms-data-types/get-capabilities-response/MetadataUrl";

export class MetadataUrlsExtractor
  implements SingleNodeDataExtractorFnFactory<MetadataUrl[] | undefined>
{
  constructor(private readonly ns: string) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    MetadataUrl[] | undefined
  > {
    return map()
      .toNodesArray(withNamespace("MetadataURL", this.ns))
      .asArray()
      .ofObjects({
        type: map().toNode("@type").mandatory().asString(),
        format: map()
          .toNode(withNamespace("Format", this.ns))
          .mandatory()
          .asString(),
        url: map()
          .toNode(`${withNamespace("OnlineResource", this.ns)}/@xlink:href`)
          .mandatory()
          .asString(),
      })
      .createNodeDataExtractor();
  }
}
