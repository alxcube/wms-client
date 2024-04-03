import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Attribution } from "../../../wms-data-types/Attribution";

export class LayerAttributionExtractorFactory
  implements SingleNodeDataExtractorFnFactory<Attribution | undefined>
{
  constructor(private readonly ns: string) {}

  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    Attribution | undefined
  > {
    return map()
      .toNode(this.withNamespace("Attribution"))
      .asObject({
        title: map().toNode(this.withNamespace("Title")).asString(),
        url: map()
          .toNode(`${this.withNamespace("OnlineResource")}/@xlink:href`)
          .asString(),
        logo: map()
          .toNode(this.withNamespace("LogoURL"))
          .asObject({
            width: map().toNode("@width").mandatory().asNumber(),
            height: map().toNode("@height").mandatory().asNumber(),
            format: map()
              .toNode(this.withNamespace("Format"))
              .mandatory()
              .asString(),
            url: map()
              .toNode(`${this.withNamespace("OnlineResource")}/@xlink:href`)
              .mandatory()
              .asString(),
          }),
      })
      .createNodeDataExtractor();
  }

  private withNamespace(nodeName: string): string {
    return this.ns.length ? `${this.ns}:${nodeName}` : nodeName;
  }
}
