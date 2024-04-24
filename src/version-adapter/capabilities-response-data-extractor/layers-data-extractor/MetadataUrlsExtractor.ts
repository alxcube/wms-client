import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { MetadataUrl } from "../data-types";

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
