import {
  createObjectMapper,
  map,
  type SingleNodeDataExtractorFn,
} from "@alxcube/xml-mapper";
import xpath, { type XPathSelect } from "xpath";
import type { ExceptionFormat } from "../../ExceptionFormat";
import type { UnifiedCapabilitiesResponse } from "../../UnifiedCapabilitiesResponse";
import { trim } from "../../utils/trim";
import type { Dimension } from "../../wms-data-types/Dimension";
import type { Keyword } from "../../wms-data-types/Keyword";
import type { Layer } from "../../wms-data-types/Layer";
import type { WmsCapabilitiesResponseDataExtractor } from "../BaseWmsVersionAdapter";

export class CapabilitiesResponseDataExtractor
  implements WmsCapabilitiesResponseDataExtractor
{
  extract(response: Document): UnifiedCapabilitiesResponse {
    return this.buildDataExtractor()(
      response,
      xpath.useNamespaces({
        wms: "http://www.opengis.net/wms",
        xlink: "http://www.w3.org/1999/xlink",
      })
    );
  }

  private buildDataExtractor(): SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse> {
    const keywordsDataExtractor = map()
      .toNodesArray("KeywordList/Keyword")
      .asArray()
      .ofObjects<Keyword>({
        value: map().toNode(".").mandatory().asString().withConversion(trim),
        vocabulary: map().toNode("@vocabulary").asString(),
      });

    const linkUrlXpath = "OnlineResource/@xlink:href";
    const linkDataExtractor = map().toNode(linkUrlXpath).asString();
    const mandatoryLinkDataExtractor = map()
      .toNode(linkUrlXpath)
      .mandatory()
      .asString();

    const layerDimensionsDataExtractor =
      this.buildLayerDimensionsDataExtractor();

    return createObjectMapper<UnifiedCapabilitiesResponse>({
      version: map()
        .toNode("/WMT_MS_Capabilities/@version")
        .mandatory()
        .asString(),
      updateSequence: map()
        .toNode("/WMT_MS_Capabilities/@updatesequence")
        .asString(),
      service: map()
        .toNode("/WMT_MS_Capabilities/Service")
        .mandatory()
        .asObject({
          title: map().toNode("Title").mandatory().asString(),
          description: map().toNode("Abstract").asString(),
          keywords: keywordsDataExtractor,
          url: mandatoryLinkDataExtractor,
          contactInformation: map()
            .toNode("ContactInformation")
            .asObject({
              contactPerson: map()
                .toNode("ContactPersonPrimary")
                .asObject({
                  name: map().toNode("ContactPerson").mandatory().asString(),
                  organization: map()
                    .toNode("ContactOrganization")
                    .mandatory()
                    .asString(),
                }),
              position: map().toNode("ContactPosition").asString(),
              address: map()
                .toNode("ContactAddress")
                .asObject({
                  addressType: map()
                    .toNode("AddressType")
                    .asString()
                    .withDefault(""),
                  address: map().toNode("Address").asString().withDefault(""),
                  city: map().toNode("City").asString().withDefault(""),
                  stateOrProvince: map()
                    .toNode("StateOrProvince")
                    .asString()
                    .withDefault(""),
                  postCode: map().toNode("PostCode").asString().withDefault(""),
                  country: map().toNode("Country").asString().withDefault(""),
                }),
              telephone: map().toNode("ContactVoiceTelephone").asString(),
              fax: map().toNode("ContactFacsimileTelephone").asString(),
              email: map().toNode("ContactElectronicMailAddress").asString(),
            }),
          fees: map().toNode("Fees").asString(),
          accessConstraints: map().toNode("AccessConstraints").asString(),
        }),
      capability: map()
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
                  httpGetUrl: map()
                    .toNode("DCPType/HTTP/Get/OnlineResource/@xlink:href")
                    .mandatory()
                    .asString(),
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
                  httpGetUrl: map()
                    .toNode("DCPType/HTTP/Get/OnlineResource/@xlink:href")
                    .mandatory()
                    .asString(),
                }),
              getFeatureInfo: map()
                .toNode("GetFeatureInfo")
                .asObject({
                  responseFormats: map()
                    .toNodesArray("Format")
                    .mandatory()
                    .asArray()
                    .ofStrings(),
                  httpGetUrl: map()
                    .toNode("DCPType/HTTP/Get/OnlineResource/@xlink:href")
                    .mandatory()
                    .asString(),
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
              keywords: keywordsDataExtractor,
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
              dimensions: layerDimensionsDataExtractor,
              attribution: map()
                .toNode("Attribution")
                .asObject({
                  title: map().toNode("Title").asString(),
                  url: linkDataExtractor,
                  logo: map()
                    .toNode("LogoURL")
                    .asObject({
                      width: map().toNode("@width").mandatory().asNumber(),
                      height: map().toNode("@height").mandatory().asNumber(),
                      format: map().toNode("Format").mandatory().asString(),
                      url: mandatoryLinkDataExtractor,
                    }),
                }),
              authorityUrls: map()
                .toNodesArray("AuthorityURL")
                .asArray()
                .ofObjects({
                  name: map().toNode("@name").mandatory().asString(),
                  url: mandatoryLinkDataExtractor,
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
                  url: mandatoryLinkDataExtractor,
                }),
              dataUrls: map()
                .toNodesArray("DataURL")
                .asArray()
                .ofObjects({
                  format: map().toNode("Format").mandatory().asString(),
                  url: mandatoryLinkDataExtractor,
                }),
              featureListUrls: map()
                .toNodesArray("FeatureListURL")
                .asArray()
                .ofObjects({
                  format: map().toNode("Format").mandatory().asString(),
                  url: mandatoryLinkDataExtractor,
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
                      url: mandatoryLinkDataExtractor,
                    }),
                  stylesheetUrl: map()
                    .toNode("StyleSheetURL")
                    .asObject({
                      format: map().toNode("Format").mandatory().asString(),
                      url: mandatoryLinkDataExtractor,
                    }),
                  styleUrl: map()
                    .toNode("StyleURL")
                    .asObject({
                      format: map().toNode("Format").mandatory().asString(),
                      url: mandatoryLinkDataExtractor,
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
        }),
    });
  }

  private buildLayerDimensionsDataExtractor(): SingleNodeDataExtractorFn<
    Layer["dimensions"]
  > {
    // Storage for unique dimensions in capabilities response, used for building Layer.dimensions[number] object,
    // when only "Extent" element is present in "Layer" element, and no parent layers has declared dimension of
    // such name. The keys are dimension names, and values are dimension units.
    const declaredDimensions: { [key: string]: string } = {};

    const extractDimensionElementData = map()
      .toNode(".")
      .mandatory()
      .asObject({
        name: map().toNode("@name").mandatory().asString(),
        units: map().toNode("@units").mandatory().asString(),
        unitSymbol: map().toNode("@unitSymbol").asString(),
      })
      .createNodeDataExtractor();

    const extractExtentNodeElementData = map()
      .toNode(".")
      .mandatory()
      .asObject({
        default: map().toNode("@default").asString(),
        multipleValues: map().toNode("@multipleValues").asBoolean(),
        nearestValue: map().toNode("@nearestValue").asBoolean(),
        current: map().toNode("@current").asBoolean(),
        value: map().toNode(".").asString(),
      })
      .createNodeDataExtractor();

    const getDimensionElementsRecursive = (node: Node, select: XPathSelect) => {
      const dimensionElements = select("Dimension", node) as Element[];
      if (node.parentNode && node.parentNode.nodeName === "Layer") {
        dimensionElements.push(
          ...getDimensionElementsRecursive(node.parentNode, select)
        );
      }
      return dimensionElements;
    };

    return (layerNode, select) => {
      if (
        !select("boolean(Dimension)", layerNode) &&
        !select("boolean(Extent)", layerNode)
      ) {
        // Do not parse dimensions, when Layer node has neither Dimension, nor Extent child elements.
        return undefined;
      }

      const dimensions: Dimension[] = [];

      // Get all dimension elements from current Layer element and from all ancestor layer elements.
      const dimensionElements = getDimensionElementsRecursive(
        layerNode,
        select
      );

      // Create object for accessing dimension data by name
      const dimensionsMap: {
        [key: string]: NonNullable<Layer["dimensions"]>[number];
      } = {};
      for (const dimensionEl of dimensionElements) {
        const name = select("string(@name)", dimensionEl) as string;
        if (!(name in dimensionsMap)) {
          dimensionsMap[name] = extractDimensionElementData(
            dimensionEl,
            select
          );
        }
      }

      // Find all Extent child elements in current Layer node.
      const extentElements = select("Extent", layerNode) as Element[];
      for (const extentEl of extentElements) {
        const name = select("string(@name)", extentEl) as string;

        // Look for dimension from current/ancestor Layer(s)
        let dimension =
          name in dimensionsMap ? { ...dimensionsMap[name] } : undefined;
        if (!dimension && name in declaredDimensions) {
          // When reference dimension is not found in current and ancestor layers, but was declared previously in XML, use it
          dimension = { name, units: declaredDimensions[name] };
        }
        if (!dimension) {
          // Reference dimension is not found, skip Extent node.
          continue;
        }

        // Add info from Extent node to Dimension object
        Object.assign(
          dimension,
          extractExtentNodeElementData(extentEl, select)
        );

        dimensions.push(dimension);

        // Save declared dimension for possible future use
        declaredDimensions[dimension.name] = dimension.units;
      }

      return dimensions;
    };
  }
}
