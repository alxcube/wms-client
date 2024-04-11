import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils/withNamespace";
import type { LayerStyle } from "../../../wms-data-types/LayerStyle";

export class StylesExtractor
  implements SingleNodeDataExtractorFnFactory<LayerStyle[] | undefined>
{
  constructor(private readonly ns: string) {}
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
        styleUrl: map()
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
          }),
      })
      .createNodeDataExtractor();
  }
}
