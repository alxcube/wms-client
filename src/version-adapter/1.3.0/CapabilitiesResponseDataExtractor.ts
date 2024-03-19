import {
  createObjectMapper,
  map,
  type SingleNodeDataExtractorFn,
} from "@alxcube/xml-mapper";
import xpath, { type XPathSelect } from "xpath";
import type { ExceptionFormat } from "../../ExceptionFormat";
import type { UnifiedCapabilitiesResponse } from "../../UnifiedCapabilitiesResponse";
import type { WmsCapabilitiesResponseDataExtractor } from "../BaseWmsVersionAdapter";

export class CapabilitiesResponseDataExtractor
  implements WmsCapabilitiesResponseDataExtractor
{
  private readonly dataExtractor: SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse>;
  private readonly xpathSelect: XPathSelect;

  constructor() {
    this.xpathSelect = xpath.useNamespaces({
      wms: "http://www.opengis.net/wms",
      xlink: "http://www.w3.org/1999/xlink",
    });

    const linkUrlXpath = "wms:OnlineResource/@xlink:href";
    const linkDataExtractor = map().toNode(linkUrlXpath).asString();
    const mandatoryLinkDataExtractor = map()
      .toNode(linkUrlXpath)
      .mandatory()
      .asString();

    this.dataExtractor = createObjectMapper<UnifiedCapabilitiesResponse>({
      version: map()
        .toNode("/wms:WMS_Capabilities/@version")
        .mandatory()
        .asString(),
      updateSequence: map()
        .toNode("/wms:WMS_Capabilities/@updatesequence")
        .asString(),
      service: map()
        .toNode("/wms:WMS_Capabilities/wms:Service")
        .mandatory()
        .asObject({
          title: map().toNode("wms:Title").mandatory().asString(),
          url: mandatoryLinkDataExtractor,
          description: map().toNode("wms:Abstract").asString(),
          keywords: map()
            .toNodesArray("wms:KeywordList/wms:Keyword")
            .asArray()
            .ofObjects({
              vocabulary: map().toNode("@vocabulary").asString(),
              value: map().toNode(".").mandatory().asString(),
            }),
          contactInformation: map()
            .toNode("wms:ContactInformation")
            .asObject({
              contactPerson: map()
                .toNode("wms:ContactPersonPrimary")
                .asObject({
                  name: map()
                    .toNode("wms:ContactPerson")
                    .mandatory()
                    .asString(),
                  organization: map()
                    .toNode("wms:ContactOrganization")
                    .mandatory()
                    .asString(),
                }),
              position: map().toNode("wms:ContactPosition").asString(),
              address: map()
                .toNode("wms:ContactAddress")
                .asObject({
                  addressType: map()
                    .toNode("wms:AddressType")
                    .mandatory()
                    .asString(),
                  address: map().toNode("wms:Address").mandatory().asString(),
                  city: map().toNode("wms:City").mandatory().asString(),
                  stateOrProvince: map()
                    .toNode("wms:StateOrProvince")
                    .mandatory()
                    .asString(),
                  postCode: map().toNode("wms:PostCode").mandatory().asString(),
                  country: map().toNode("wms:Country").mandatory().asString(),
                }),
              telephone: map().toNode("wms:ContactVoiceTelephone").asString(),
              fax: map().toNode("wms:ContactFacsimileTelephone").asString(),
              email: map()
                .toNode("wms:ContactElectronicMailAddress")
                .asString(),
            }),
          fees: map().toNode("wms:Fees").asString(),
          accessConstraints: map().toNode("wms:AccessConstraints").asString(),
          layerLimit: map().toNode("wms:LayerLimit").asNumber(),
          maxWidth: map().toNode("wms:MaxWidth").asNumber(),
          maxHeight: map().toNode("wms:MaxHeight").asNumber(),
        }),
      capability: map()
        .toNode("/wms:WMS_Capabilities/wms:Capability")
        .mandatory()
        .asObject({
          request: map()
            .toNode("wms:Request")
            .mandatory()
            .asObject({
              getCapabilities: map()
                .toNode("wms:GetCapabilities")
                .mandatory()
                .asObject({
                  responseFormats: map()
                    .toNodesArray("wms:Format")
                    .mandatory()
                    .asArray()
                    .ofStrings(),
                  httpGetUrl: map()
                    .toNode(
                      "wms:DCPType/wms:HTTP/wms:Get/wms:OnlineResource/@xlink:href"
                    )
                    .mandatory()
                    .asString(),
                }),
              getMap: map()
                .toNode("wms:GetMap")
                .mandatory()
                .asObject({
                  responseFormats: map()
                    .toNodesArray("wms:Format")
                    .mandatory()
                    .asArray()
                    .ofStrings(),
                  httpGetUrl: map()
                    .toNode(
                      "wms:DCPType/wms:HTTP/wms:Get/wms:OnlineResource/@xlink:href"
                    )
                    .mandatory()
                    .asString(),
                }),
              getFeatureInfo: map()
                .toNode("wms:GetFeatureInfo")
                .asObject({
                  responseFormats: map()
                    .toNodesArray("wms:Format")
                    .mandatory()
                    .asArray()
                    .ofStrings(),
                  httpGetUrl: map()
                    .toNode(
                      "wms:DCPType/wms:HTTP/wms:Get/wms:OnlineResource/@xlink:href"
                    )
                    .mandatory()
                    .asString(),
                }),
            }),
          exceptionFormats: map()
            .toNodesArray("wms:Exception/wms:Format")
            .mandatory()
            .asArray()
            .ofStrings()
            .withConversion((formats) => {
              return formats as ExceptionFormat[];
            }),
          layers: map()
            .toNodesArray("wms:Layer")
            .mandatory()
            .asArray()
            .ofRecursiveObjects((layersRecursion) => ({
              title: map().toNode("wms:Title").mandatory().asString(),
              crs: map().toNodesArray("wms:CRS").asArray().ofStrings(),
              name: map().toNode("wms:Name").asString(),
              description: map().toNode("wms:Abstract").asString(),
              keywords: map()
                .toNodesArray("wms:KeywordList/wms:Keyword")
                .asArray()
                .ofObjects({
                  vocabulary: map().toNode("@vocabulary").asString(),
                  value: map().toNode(".").mandatory().asString(),
                }),
              geographicBounds: map()
                .toNode("wms:EX_GeographicBoundingBox")
                .asObject({
                  north: map()
                    .toNode("wms:northBoundLatitude")
                    .mandatory()
                    .asNumber(),
                  south: map()
                    .toNode("wms:southBoundLatitude")
                    .mandatory()
                    .asNumber(),
                  west: map()
                    .toNode("wms:westBoundLongitude")
                    .mandatory()
                    .asNumber(),
                  east: map()
                    .toNode("wms:eastBoundLongitude")
                    .mandatory()
                    .asNumber(),
                }),
              boundingBoxes: map()
                .toNodesArray("wms:BoundingBox")
                .asArray()
                .ofObjects({
                  crs: map().toNode("@CRS").mandatory().asString(),
                  minX: map().toNode("@minx").mandatory().asNumber(),
                  maxX: map().toNode("@maxx").mandatory().asNumber(),
                  minY: map().toNode("@miny").mandatory().asNumber(),
                  maxY: map().toNode("@maxy").mandatory().asNumber(),
                  resX: map().toNode("@resx").asNumber(),
                  resY: map().toNode("@resy").asNumber(),
                }),
              dimensions: map()
                .toNodesArray("wms:Dimension")
                .asArray()
                .ofObjects({
                  name: map().toNode("@name").mandatory().asString(),
                  units: map().toNode("@units").mandatory().asString(),
                  unitSymbol: map().toNode("@unitSymbol").asString(),
                  default: map().toNode("@default").asString(),
                  multipleValues: map().toNode("@multipleValues").asBoolean(),
                  nearestValue: map().toNode("@nearestValue").asBoolean(),
                  current: map().toNode("@current").asBoolean(),
                  value: map().toNode(".").asString(),
                }),
              attribution: map()
                .toNode("wms:Attribution")
                .asObject({
                  title: map().toNode("wms:Title").asString(),
                  url: linkDataExtractor,
                  logo: map()
                    .toNode("wms:LogoURL")
                    .asObject({
                      width: map().toNode("@width").mandatory().asNumber(),
                      height: map().toNode("@height").mandatory().asNumber(),
                      format: map().toNode("wms:Format").mandatory().asString(),
                      url: mandatoryLinkDataExtractor,
                    }),
                }),
              authorityUrls: map()
                .toNodesArray("wms:AuthorityURL")
                .asArray()
                .ofObjects({
                  name: map().toNode("@name").mandatory().asString(),
                  url: mandatoryLinkDataExtractor,
                }),
              identifiers: map()
                .toNodesArray("wms:Identifier")
                .asArray()
                .ofObjects({
                  authority: map().toNode("@authority").mandatory().asString(),
                  value: map().toNode(".").mandatory().asString(),
                }),
              metadataUrls: map()
                .toNodesArray("wms:MetadataURL")
                .asArray()
                .ofObjects({
                  format: map().toNode("wms:Format").mandatory().asString(),
                  type: map().toNode("@type").mandatory().asString(),
                  url: mandatoryLinkDataExtractor,
                }),
              dataUrls: map()
                .toNodesArray("wms:DataURL")
                .asArray()
                .ofObjects({
                  format: map().toNode("wms:Format").mandatory().asString(),
                  url: mandatoryLinkDataExtractor,
                }),
              featureListUrls: map()
                .toNodesArray("wms:FeatureListURL")
                .asArray()
                .ofObjects({
                  format: map().toNode("wms:Format").mandatory().asString(),
                  url: mandatoryLinkDataExtractor,
                }),
              styles: map()
                .toNodesArray("wms:Style")
                .asArray()
                .ofObjects({
                  name: map().toNode("wms:Name").mandatory().asString(),
                  title: map().toNode("wms:Title").mandatory().asString(),
                  description: map().toNode("wms:Abstract").asString(),
                  legendUrls: map()
                    .toNodesArray("wms:LegendURL")
                    .asArray()
                    .ofObjects({
                      format: map().toNode("wms:Format").mandatory().asString(),
                      width: map().toNode("@width").mandatory().asNumber(),
                      height: map().toNode("@height").mandatory().asNumber(),
                      url: mandatoryLinkDataExtractor,
                    }),
                  stylesheetUrl: map()
                    .toNode("wms:StyleSheetURL")
                    .asObject({
                      format: map().toNode("wms:Format").mandatory().asString(),
                      url: mandatoryLinkDataExtractor,
                    }),
                  styleUrl: map()
                    .toNode("wms:StyleURL")
                    .asObject({
                      format: map().toNode("wms:Format").mandatory().asString(),
                      url: mandatoryLinkDataExtractor,
                    }),
                }),
              minScaleDenominator: map()
                .toNode("wms:MinScaleDenominator")
                .asString()
                .withConversion(parseFloat),
              maxScaleDenominator: map()
                .toNode("wms:MaxScaleDenominator")
                .asString()
                .withConversion(parseFloat),
              queryable: map().toNode("@queryable").asBoolean(),
              cascaded: map().toNode("@cascaded").asNumber(),
              opaque: map().toNode("@opaque").asBoolean(),
              noSubsets: map().toNode("@noSubsets").asBoolean(),
              fixedWidth: map().toNode("@fixedWidth").asNumber(),
              fixedHeight: map().toNode("@fixedHeight").asNumber(),
              layers: map()
                .toNodesArray("wms:Layer")
                .asArray()
                .ofRecursiveObjects(layersRecursion),
            })),
        }),
    });
  }
  extract(response: Document): UnifiedCapabilitiesResponse {
    return this.dataExtractor(response, this.xpathSelect);
  }
}
