import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Attribution } from "../../../../wms-data-types/Attribution";

export class LayerAttributionExtractorFactory
  implements SingleNodeDataExtractorFnFactory<Attribution | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    Attribution | undefined
  > {
    return map()
      .toNode("Attribution")
      .asObject({
        title: map().toNode("Title").asString(),
        url: map().toNode("OnlineResource/@xlink:href").asString(),
        logo: map()
          .toNode("LogoURL")
          .asObject({
            width: map().toNode("@width").mandatory().asNumber(),
            height: map().toNode("@height").mandatory().asNumber(),
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
