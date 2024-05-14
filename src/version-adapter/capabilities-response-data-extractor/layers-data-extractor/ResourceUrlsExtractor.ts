import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { ResourceUrl } from "../data-types";

/**
 * Generic extractor for `ResourceUrl` objects.
 */
export class ResourceUrlsExtractor
  implements SingleNodeDataExtractorFnFactory<ResourceUrl[] | undefined>
{
  /**
   * ResourceUrlExtractor constructor.
   *
   * @param nodeName
   * @param ns
   */
  constructor(
    private readonly nodeName: string,
    private readonly ns: string
  ) {}

  /**
   * @inheritdoc
   */
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
