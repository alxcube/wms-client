import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils/withNamespace";
import type { ResourceUrl } from "../../../wms-data-types/get-capabilities-response/ResourceUrl";

export class ResourceUrlsExtractor
  implements SingleNodeDataExtractorFnFactory<ResourceUrl[] | undefined>
{
  constructor(
    private readonly nodeName: string,
    private readonly ns: string
  ) {}

  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    ResourceUrl[] | undefined
  > {
    return map()
      .toNodesArray(withNamespace(this.nodeName, this.ns))
      .asArray()
      .ofObjects({
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
