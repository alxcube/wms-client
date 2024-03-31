import {
  map,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { ResourceUrl } from "../../../../wms-data-types/ResourceUrl";

export class ResourceUrlsExtractorFactory {
  createForNodeName(
    nodeName: string
  ): SingleNodeDataExtractorFnFactory<ResourceUrl[] | undefined> {
    return map()
      .toNodesArray(nodeName)
      .asArray()
      .ofObjects({
        format: map().toNode("Format").mandatory().asString(),
        url: map().toNode("OnlineResource/@xlink:href").mandatory().asString(),
      });
  }
}
