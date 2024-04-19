import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../../wms-data-types/ExceptionFormat";
import type { Layer } from "../../wms-data-types/get-capabilities-response/Layer";
import type { OperationType } from "../../wms-data-types/get-capabilities-response/OperationType";
import type { UnifiedCapabilitiesResponse } from "../../wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";
import type { XmlDataExtractor } from "./XmlDataExtractor";

export class CapabilitiesSectionExtractor_1_0
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["capability"]>
{
  constructor(private readonly layersExtractor: XmlDataExtractor<Layer[]>) {}

  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["capability"]
  > {
    return map()
      .toNode("/WMT_MS_Capabilities/Capability")
      .mandatory()
      .asObject<UnifiedCapabilitiesResponse["capability"]>({
        request: map()
          .toNode("Request")
          .mandatory()
          .asObject({
            getCapabilities: this.buildOperationTypeExtractor("Capabilities"),
            getMap: this.buildOperationTypeExtractor("Map"),
            getFeatureInfo: this.buildOperationTypeExtractor(
              "FeatureInfo",
              true
            ),
          }),
        exceptionFormats: map()
          .toNodesArray("Exception/Format/*")
          .mandatory()
          .asArray()
          .usingMapper((formatNode) => {
            const format = formatNode.nodeName.toUpperCase();
            return format === "WMS_XML" ? "XML" : (format as ExceptionFormat);
          }),
        layers: this.layersExtractor,
      })
      .createNodeDataExtractor();
  }

  private buildOperationTypeExtractor(
    requestType: string
  ): SingleNodeDataExtractorFnFactory<OperationType>;
  private buildOperationTypeExtractor(
    requestType: string,
    optional: true
  ): SingleNodeDataExtractorFnFactory<OperationType | undefined>;
  private buildOperationTypeExtractor(
    requestType: string,
    optional = false
  ):
    | SingleNodeDataExtractorFnFactory<OperationType>
    | SingleNodeDataExtractorFnFactory<OperationType | undefined> {
    let builder = map().toNode(requestType);
    if (!optional) {
      builder = builder.mandatory();
    }
    return builder.asObject<OperationType>({
      responseFormats: map()
        .toNodesArray("Format/*")
        .mandatory()
        .asArray()
        .usingMapper((formatNode) => formatNode.nodeName),
      httpGetUrl: map()
        .toNode("DCPType/HTTP/Get/@onlineResource")
        .mandatory()
        .asString(),
    });
  }
}
