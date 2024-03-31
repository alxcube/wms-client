import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../../../ExceptionFormat";
import type {
  OperationType,
  UnifiedCapabilitiesResponse,
} from "../../../UnifiedCapabilitiesResponse";
import type { LayersExtractorFactory } from "./layers-data-extractor/LayersExtractorFactory";

export class CapabilitiesSectionExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["capability"]>
{
  constructor(private layersDataExtractor: LayersExtractorFactory) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["capability"]
  > {
    return map()
      .toNode("/WMT_MS_Capabilities/Capability")
      .mandatory()
      .asObject({
        request: map()
          .toNode("Request")
          .mandatory()
          .asObject({
            getCapabilities:
              this.buildOperationTypeExtractor("GetCapabilities"),
            getMap: this.buildOperationTypeExtractor("GetMap"),
            getFeatureInfo: this.buildOperationTypeExtractor(
              "GetFeatureInfo",
              true
            ),
          }),
        exceptionFormats: map()
          .toNodesArray("Exception/Format")
          .mandatory()
          .asArray()
          .ofStrings()
          .withConversion((formats) =>
            formats.map((format) => {
              switch (format) {
                case "application/vnd.ogc.se_xml":
                  return "XML";
                case "application/vnd.ogc.se_inimage":
                  return "INIMAGE";
                case "application/vnd.ogc.se_blank":
                  return "BLANK";
                default:
                  return format as ExceptionFormat;
              }
            })
          ),
        layers: this.layersDataExtractor,
      })
      .createNodeDataExtractor();
  }
  protected buildLinkUrlDataExtractor(): SingleNodeDataExtractorFnFactory<string>;
  protected buildLinkUrlDataExtractor(
    pathPrefix: string,
    mandatory: false
  ): SingleNodeDataExtractorFnFactory<string | undefined>;
  protected buildLinkUrlDataExtractor(
    pathPrefix: string,
    mandatory: true
  ): SingleNodeDataExtractorFnFactory<string>;
  protected buildLinkUrlDataExtractor(
    pathPrefix = "",
    mandatory: boolean = true
  ):
    | SingleNodeDataExtractorFnFactory<string | undefined>
    | SingleNodeDataExtractorFnFactory<string> {
    let builder = map().toNode(`${pathPrefix}OnlineResource/@xlink:href`);
    if (mandatory) {
      builder = builder.mandatory();
    }
    return builder.asString();
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
    return builder.asObject({
      responseFormats: map()
        .toNodesArray("Format")
        .mandatory()
        .asArray()
        .ofStrings(),
      httpGetUrl: this.buildLinkUrlDataExtractor("DCPType/HTTP/Get/", true),
    });
  }
}
