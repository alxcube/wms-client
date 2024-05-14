import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { Attribution } from "../data-types";

/**
 * Data extractor factory for `Attribution` interface extractor.
 */
export class AttributionExtractor
  implements SingleNodeDataExtractorFnFactory<Attribution | undefined>
{
  /**
   * AttributionExtractor constructor.
   *
   * @param ns
   */
  constructor(private readonly ns: string) {}

  /**
   * @inheritdoc
   */
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    Attribution | undefined
  > {
    return map()
      .toNode(withNamespace("Attribution", this.ns))
      .asObject({
        title: map().toNode(withNamespace("Title", this.ns)).asString(),
        url: map()
          .toNode(`${withNamespace("OnlineResource", this.ns)}/@xlink:href`)
          .asString(),
        logo: map()
          .toNode(withNamespace("LogoURL", this.ns))
          .asObject({
            width: map().toNode("@width").mandatory().asNumber(),
            height: map().toNode("@height").mandatory().asNumber(),
            format: map()
              .toNode(withNamespace("Format", this.ns))
              .mandatory()
              .asString(),
            url: map()
              .toNode(`${withNamespace("OnlineResource", this.ns)}/@xlink:href`)
              .mandatory()
              .asString(),
          }),
      })
      .createNodeDataExtractor();
  }
}
