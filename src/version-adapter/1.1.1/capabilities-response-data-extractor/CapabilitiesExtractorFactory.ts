import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../../../ExceptionFormat";
import type { UnifiedCapabilitiesResponse } from "../../../UnifiedCapabilitiesResponse";
import type { Layer } from "../../../wms-data-types/Layer";
import type { KeywordsExtractorFactory } from "./KeywordsExtractorFactory";
import type { LayerDimensionsExtractorFactory } from "./LayerDimensionsExtractorFactory";

export class CapabilitiesExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["capability"]>
{
  constructor(
    private readonly layerDimensionsExtractorFactory: LayerDimensionsExtractorFactory,
    private readonly keywordsDataExtractor: KeywordsExtractorFactory
  ) {}
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
            getCapabilities: map()
              .toNode("GetCapabilities")
              .mandatory()
              .asObject({
                responseFormats: map()
                  .toNodesArray("Format")
                  .mandatory()
                  .asArray()
                  .ofStrings(),
                httpGetUrl: this.buildLinkUrlDataExtractor(
                  "DCPType/HTTP/Get/",
                  true
                ),
              }),
            getMap: map()
              .toNode("GetMap")
              .mandatory()
              .asObject({
                responseFormats: map()
                  .toNodesArray("Format")
                  .mandatory()
                  .asArray()
                  .ofStrings(),
                httpGetUrl: this.buildLinkUrlDataExtractor(
                  "DCPType/HTTP/Get/",
                  true
                ),
              }),
            getFeatureInfo: map()
              .toNode("GetFeatureInfo")
              .asObject({
                responseFormats: map()
                  .toNodesArray("Format")
                  .mandatory()
                  .asArray()
                  .ofStrings(),
                httpGetUrl: this.buildLinkUrlDataExtractor(
                  "DCPType/HTTP/Get/",
                  true
                ),
              }),
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
        layers: map()
          .toNodesArray("Layer")
          .mandatory()
          .asArray()
          .ofRecursiveObjects<Layer>((recursion) => ({
            title: map().toNode("Title").mandatory().asString(),
            crs: map().toNodesArray("SRS").asArray().ofStrings(),
            name: map().toNode("Name").asString(),
            description: map().toNode("Abstract").asString(),
            keywords: this.keywordsDataExtractor,
            geographicBounds: map()
              .toNode("LatLonBoundingBox")
              .asObject({
                west: map().toNode("@minx").mandatory().asNumber(),
                south: map().toNode("@miny").mandatory().asNumber(),
                east: map().toNode("@maxx").mandatory().asNumber(),
                north: map().toNode("@maxy").mandatory().asNumber(),
              }),
            boundingBoxes: map()
              .toNodesArray("BoundingBox")
              .asArray()
              .ofObjects({
                crs: map().toNode("@SRS").mandatory().asString(),
                minX: map().toNode("@minx").mandatory().asNumber(),
                minY: map().toNode("@miny").mandatory().asNumber(),
                maxX: map().toNode("@maxx").mandatory().asNumber(),
                maxY: map().toNode("@maxy").mandatory().asNumber(),
                resX: map().toNode("@resx").asNumber(),
                resY: map().toNode("@resy").asNumber(),
              }),
            dimensions: this.layerDimensionsExtractorFactory,
            attribution: map()
              .toNode("Attribution")
              .asObject({
                title: map().toNode("Title").asString(),
                url: this.buildLinkUrlDataExtractor("", false),
                logo: map()
                  .toNode("LogoURL")
                  .asObject({
                    width: map().toNode("@width").mandatory().asNumber(),
                    height: map().toNode("@height").mandatory().asNumber(),
                    format: map().toNode("Format").mandatory().asString(),
                    url: this.buildLinkUrlDataExtractor(),
                  }),
              }),
            authorityUrls: map()
              .toNodesArray("AuthorityURL")
              .asArray()
              .ofObjects({
                name: map().toNode("@name").mandatory().asString(),
                url: this.buildLinkUrlDataExtractor(),
              }),
            identifiers: map()
              .toNodesArray("Identifier")
              .asArray()
              .ofObjects({
                authority: map().toNode("@authority").mandatory().asString(),
                value: map().toNode(".").mandatory().asString(),
              }),
            metadataUrls: map()
              .toNodesArray("MetadataURL")
              .asArray()
              .ofObjects({
                type: map().toNode("@type").mandatory().asString(),
                format: map().toNode("Format").mandatory().asString(),
                url: this.buildLinkUrlDataExtractor(),
              }),
            dataUrls: map()
              .toNodesArray("DataURL")
              .asArray()
              .ofObjects({
                format: map().toNode("Format").mandatory().asString(),
                url: this.buildLinkUrlDataExtractor(),
              }),
            featureListUrls: map()
              .toNodesArray("FeatureListURL")
              .asArray()
              .ofObjects({
                format: map().toNode("Format").mandatory().asString(),
                url: this.buildLinkUrlDataExtractor(),
              }),
            styles: map()
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
                    url: this.buildLinkUrlDataExtractor(),
                  }),
                stylesheetUrl: map()
                  .toNode("StyleSheetURL")
                  .asObject({
                    format: map().toNode("Format").mandatory().asString(),
                    url: this.buildLinkUrlDataExtractor(),
                  }),
                styleUrl: map()
                  .toNode("StyleURL")
                  .asObject({
                    format: map().toNode("Format").mandatory().asString(),
                    url: this.buildLinkUrlDataExtractor(),
                  }),
              }),
            scaleHint: map()
              .toNode("ScaleHint")
              .asObject({
                min: map().toNode("@min").mandatory().asNumber(),
                max: map().toNode("@max").mandatory().asNumber(),
              }),
            queryable: map().toNode("@queryable").asBoolean(),
            cascaded: map().toNode("@cascaded").asNumber(),
            opaque: map().toNode("@opaque").asBoolean(),
            noSubsets: map().toNode("@noSubsets").asBoolean(),
            fixedWidth: map().toNode("@fixedWidth").asNumber(),
            fixedHeight: map().toNode("@fixedHeight").asNumber(),
            layers: map()
              .toNodesArray("Layer")
              .asArray()
              .ofRecursiveObjects(recursion),
          })),
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
}
