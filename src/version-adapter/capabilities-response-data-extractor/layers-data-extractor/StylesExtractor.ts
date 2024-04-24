import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { LayerStyle, ResourceUrl } from "../data-types";
import type { XmlDataExtractor } from "../XmlDataExtractor";

export class StylesExtractor
  implements SingleNodeDataExtractorFnFactory<LayerStyle[] | undefined>
{
  constructor(
    private readonly styleUrlExtractor: XmlDataExtractor<
      ResourceUrl | undefined
    >,
    private readonly ns: string
  ) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    LayerStyle[] | undefined
  > {
    return map()
      .toNodesArray(withNamespace("Style", this.ns))
      .asArray()
      .ofObjects({
        name: map()
          .toNode(withNamespace("Name", this.ns))
          .mandatory()
          .asString(),
        title: map()
          .toNode(withNamespace("Title", this.ns))
          .mandatory()
          .asString(),
        description: map()
          .toNode(withNamespace("Abstract", this.ns))
          .asString(),
        legendUrls: map()
          .toNodesArray(withNamespace("LegendURL", this.ns))
          .asArray()
          .ofObjects({
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
        stylesheetUrl: map()
          .toNode(withNamespace("StyleSheetURL", this.ns))
          .asObject({
            format: map()
              .toNode(withNamespace("Format", this.ns))
              .mandatory()
              .asString(),
            url: map()
              .toNode(`${withNamespace("OnlineResource", this.ns)}/@xlink:href`)
              .mandatory()
              .asString(),
          }),
        styleUrl: this.styleUrlExtractor,
      })
      .createNodeDataExtractor();
  }
}
