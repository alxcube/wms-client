import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { LayerStyle } from "../../../../wms-data-types/LayerStyle";

export class LayerStylesExtractorFactory
  implements SingleNodeDataExtractorFnFactory<LayerStyle[] | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    LayerStyle[] | undefined
  > {
    return map()
      .toNodesArray("Style")
      .asArray()
      .ofObjects({
        name: map().toNode("Name").mandatory().asString(),
        title: map().toNode("Title").mandatory().asString(),
        description: map().toNode("Abstract").asString(),
        legendUrls: map()
          .toNodesArray("LegendURL")
          .asArray()
          .ofObjects({
            width: map().toNode("@width").mandatory().asNumber(),
            height: map().toNode("@height").mandatory().asNumber(),
            format: map().toNode("Format").mandatory().asString(),
            url: map()
              .toNode("OnlineResource/@xlink:href")
              .mandatory()
              .asString(),
          }),
        stylesheetUrl: map()
          .toNode("StyleSheetURL")
          .asObject({
            format: map().toNode("Format").mandatory().asString(),
            url: map()
              .toNode("OnlineResource/@xlink:href")
              .mandatory()
              .asString(),
          }),
        styleUrl: map()
          .toNode("StyleURL")
          .asObject({
            format: map().toNode("Format").mandatory().asString(),
            url: map()
              .toNode("OnlineResource/@xlink:href")
              .mandatory()
              .asString(),
          }),
      })
      .createNodeDataExtractor();
  }
}
