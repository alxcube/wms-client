import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../utils";
import type { ExceptionFormat } from "../../error";
import type {
  OperationType,
  UnifiedCapabilitiesResponse,
  Layer,
} from "./data-types";
import type { XmlDataExtractor } from "./XmlDataExtractor";

/**
 * Extractor of 'capability' section of `UnifiedCapabilitiesResponse`, compatible with WMS 1.1, 1.3.
 */
export class CapabilitiesSectionExtractor
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["capability"]>
{
  /**
   * CapabilitiesSectionExtractor constructor.
   *
   * @param layersDataExtractor
   * @param exceptionFormatsExtractor
   * @param rootNodeName
   * @param ns
   */
  constructor(
    private layersDataExtractor: XmlDataExtractor<Layer[]>,
    private exceptionFormatsExtractor: XmlDataExtractor<ExceptionFormat[]>,
    private readonly rootNodeName: string,
    private readonly ns: string
  ) {}

  /**
   * @inheritdoc
   */
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["capability"]
  > {
    return map()
      .toNode(
        `/${withNamespace(this.rootNodeName, this.ns)}/${this.withNamespace("Capability")}`
      )
      .mandatory()
      .asObject({
        request: map()
          .toNode(this.withNamespace("Request"))
          .mandatory()
          .asObject({
            getCapabilities:
              this.buildOperationTypeExtractor("GetCapabilities"),
            getMap: this.buildOperationTypeExtractor("GetMap"),
            getFeatureInfo: this.buildOperationTypeExtractor(
              "GetFeatureInfo",
              true
            ),
            describeLayer: this.buildOperationTypeExtractor(
              "DescribeLayer",
              true
            ),
          }),
        exceptionFormats: this.exceptionFormatsExtractor,
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
    let builder = map().toNode(
      `${pathPrefix}${this.withNamespace("OnlineResource")}/@xlink:href`
    );
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
    let builder = map().toNode(this.withNamespace(requestType));
    if (!optional) {
      builder = builder.mandatory();
    }
    return builder.asObject({
      responseFormats: map()
        .toNodesArray(this.withNamespace("Format"))
        .mandatory()
        .asArray()
        .ofStrings(),
      httpGetUrl: this.buildLinkUrlDataExtractor(
        `${this.withNamespace("DCPType")}/${this.withNamespace("HTTP")}/${this.withNamespace("Get")}/`,
        true
      ),
    });
  }

  private withNamespace(nodeName: string): string {
    return this.ns.length ? `${this.ns}:${nodeName}` : nodeName;
  }
}
