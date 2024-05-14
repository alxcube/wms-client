import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { ResourceUrl } from "../data-types";

/**
 * <StyleURL/> node data extractor, compatible with WMS 1.1, 1.3.
 */
export class StyleUrlExtractor_1_1
  implements SingleNodeDataExtractorFnFactory<ResourceUrl | undefined>
{
  /**
   * StyleUrlExtractor_1_1 constructor.
   *
   * @param ns
   */
  constructor(private readonly ns: string) {}

  /**
   * @inheritdoc
   */
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    ResourceUrl | undefined
  > {
    return map()
      .toNode(withNamespace("StyleURL", this.ns))
      .asObject({
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
