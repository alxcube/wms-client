import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { AuthorityUrl } from "../../../../wms-data-types/AuthorityUrl";

export class LayerAuthorityUrlsExtractorFactory
  implements SingleNodeDataExtractorFnFactory<AuthorityUrl[] | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    AuthorityUrl[] | undefined
  > {
    return map()
      .toNodesArray("AuthorityURL")
      .asArray()
      .ofObjects({
        name: map().toNode("@name").mandatory().asString(),
        url: map().toNode("OnlineResource/@xlink:href").mandatory().asString(),
      })
      .createNodeDataExtractor();
  }
}
