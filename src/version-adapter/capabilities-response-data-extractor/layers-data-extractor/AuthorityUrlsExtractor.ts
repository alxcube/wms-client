import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils/withNamespace";
import type { AuthorityUrl } from "../../../wms-data-types/AuthorityUrl";

export class AuthorityUrlsExtractor
  implements SingleNodeDataExtractorFnFactory<AuthorityUrl[] | undefined>
{
  constructor(private readonly ns: string) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    AuthorityUrl[] | undefined
  > {
    return map()
      .toNodesArray(withNamespace("AuthorityURL", this.ns))
      .asArray()
      .ofObjects({
        name: map().toNode("@name").mandatory().asString(),
        url: map()
          .toNode(`${withNamespace("OnlineResource", this.ns)}/@xlink:href`)
          .mandatory()
          .asString(),
      })
      .createNodeDataExtractor();
  }
}
