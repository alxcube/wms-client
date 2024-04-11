import { map } from "@alxcube/xml-mapper";
import { GenericExceptionReportExtractor } from "../error/GenericExceptionReportExtractor";
import type { ExceptionFormat } from "../wms-data-types/ExceptionFormat";
import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { GenericCapabilitiesRequestParamsTransformer } from "./capabilities-request-params-transformer/GenericCapabilitiesRequestParamsTransformer";
import { GenericCapabilitiesResponseDataExtractor } from "./capabilities-response-data-extractor/GenericCapabilitiesResponseDataExtractor";
import { CapabilitiesSectionExtractor } from "./capabilities-response-data-extractor/CapabilitiesSectionExtractor";
import { KeywordsExtractor } from "./capabilities-response-data-extractor/KeywordsExtractor";
import { AttributionExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/AttributionExtractor";
import { AuthorityUrlsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/AuthorityUrlsExtractor";
import { BoundingBoxesExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/BoundingBoxesExtractor";
import { CrsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/CrsExtractor";
import { IdentifiersExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/IdentifiersExtractor";
import { MetadataUrlsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/MetadataUrlsExtractor";
import { ResourceUrlsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/ResourceUrlsExtractor";
import { LayersExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/LayersExtractor";
import { StylesExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/StylesExtractor";
import { ServiceSectionExtractor } from "./capabilities-response-data-extractor/ServiceSectionExtractor";
import { xlinkXmlNamespace } from "./capabilities-response-data-extractor/xlinkXmlNamespace";
import { GenericMapRequestParamsTransformer } from "./map-request-params-transformer/GenericMapRequestParamsTransformer";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";
import { RangeVersionCompatibilityChecker } from "./version-compatibility-checker/RangeVersionCompatibilityChecker";
import { wmsXmlNamespace } from "./capabilities-response-data-extractor/wmsXmlNamespace";

export const versionAdapterContainerModule_1_3_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.3.0";
    const rootNodeName = "wms:WMS_Capabilities";
    const namespace = "wms";

    container.implement(
      "VersionCompatibilityChecker",
      RangeVersionCompatibilityChecker,
      ["VersionComparator", constant("1.3"), constant("1.4")],
      { name }
    );

    container.implement(
      "WmsVersionAdapter",
      BaseWmsVersionAdapter,
      [
        constant("1.3.0"),
        { service: "CapabilitiesRequestParamsTransformer", name },
        { service: "CapabilitiesResponseDataExtractor", name },
        { service: "MapRequestParamsTransformer", name },
        { service: "VersionCompatibilityChecker", name },
      ],
      { name }
    );

    // GetCapabilities request params transformer v1.3.0
    container.implement(
      "CapabilitiesRequestParamsTransformer",
      GenericCapabilitiesRequestParamsTransformer,
      [constant(name)],
      { name }
    );

    // Keywords extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Keyword[]>",
      KeywordsExtractor,
      [constant(namespace)],
      { name }
    );

    // Service section extractor v1.3.0
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      ServiceSectionExtractor,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        constant(rootNodeName),
        constant(namespace),
      ],
      { name }
    );

    // Layer CRS extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[crs]>",
      CrsExtractor,
      [constant("wms:CRS")],
      { name }
    );

    // Layer dimensions extractor v1.3.0
    container.registerConstant(
      "XmlDataExtractor<Layer[dimensions]>",
      map()
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
      { name }
    );

    // Layer geographic bounds extractor v1.3.0
    container.registerConstant(
      "XmlDataExtractor<Layer[geographicBounds]>",
      map()
        .toNode("wms:EX_GeographicBoundingBox")
        .asObject({
          north: map().toNode("wms:northBoundLatitude").mandatory().asNumber(),
          south: map().toNode("wms:southBoundLatitude").mandatory().asNumber(),
          west: map().toNode("wms:westBoundLongitude").mandatory().asNumber(),
          east: map().toNode("wms:eastBoundLongitude").mandatory().asNumber(),
        }),
      { name }
    );

    // Layer bounding boxes extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[boundingBoxes]>",
      BoundingBoxesExtractor,
      [constant("CRS"), constant("wms")],
      { name }
    );

    // Layer attribution extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[attribution]>",
      AttributionExtractor,
      [constant("wms")],
      { name }
    );

    // Layer authority URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[authorityUrls]>",
      AuthorityUrlsExtractor,
      [constant("wms")],
      { name }
    );

    // Layer identifiers extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[identifiers]>",
      IdentifiersExtractor,
      [constant("wms")],
      { name }
    );

    // Layer metadata URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[metadataUrls]>",
      MetadataUrlsExtractor,
      [constant("wms")],
      { name }
    );

    // Layer data URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[dataUrls]>",
      ResourceUrlsExtractor,
      [constant("DataURL"), constant("wms")],
      { name }
    );

    // Layer feature list URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[featureListUrls]>",
      ResourceUrlsExtractor,
      [constant("FeatureListURL"), constant("wms")],
      { name }
    );

    // Layer styles extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[styles]>",
      StylesExtractor,
      [constant("wms")],
      { name }
    );

    // Layers data extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[]>",
      LayersExtractor,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        { service: "XmlDataExtractor<Layer[crs]>", name },
        { service: "XmlDataExtractor<Layer[dimensions]>", name },
        { service: "XmlDataExtractor<Layer[geographicBounds]>", name },
        { service: "XmlDataExtractor<Layer[boundingBoxes]>", name },
        { service: "XmlDataExtractor<Layer[attribution]>", name },
        { service: "XmlDataExtractor<Layer[authorityUrls]>", name },
        { service: "XmlDataExtractor<Layer[identifiers]>", name },
        { service: "XmlDataExtractor<Layer[metadataUrls]>", name },
        { service: "XmlDataExtractor<Layer[dataUrls]>", name },
        { service: "XmlDataExtractor<Layer[featureListUrls]>", name },
        { service: "XmlDataExtractor<Layer[styles]>", name },
        constant("wms"),
      ],
      { name }
    );

    container.registerConstant(
      "XmlDataExtractor<ExceptionFormat[]>",
      map()
        .toNodesArray("wms:Exception/wms:Format")
        .mandatory()
        .asArray()
        .ofStrings()
        .withConversion((formats) => {
          return formats as ExceptionFormat[];
        }),
      { name }
    );

    // Capability section extractor v1.3.0
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
      CapabilitiesSectionExtractor,
      [
        { service: "XmlDataExtractor<Layer[]>", name },
        { service: "XmlDataExtractor<ExceptionFormat[]>", name },
        constant("wms:WMS_Capabilities"),
        constant("wms"),
      ],
      { name }
    );

    container.implement(
      "CapabilitiesResponseDataExtractor",
      GenericCapabilitiesResponseDataExtractor,
      [
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
          name,
        },
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
          name,
        },
        constant({
          xlink: xlinkXmlNamespace,
          wms: wmsXmlNamespace,
        }),
      ],
      { name }
    );

    container.implement(
      "MapRequestParamsTransformer",
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.3.0")],
      { name }
    );

    container.implement(
      "ExceptionReportExtractor",
      GenericExceptionReportExtractor,
      [
        "XmlResponseVersionExtractor",
        "VersionComparator",
        constant("1.3.0"),
        constant("1.4.0"),
        constant("ogc"),
      ],
      { name }
    );
  },
};
