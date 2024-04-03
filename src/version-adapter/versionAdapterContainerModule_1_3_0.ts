import { map } from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../ExceptionFormat";
import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { GenericCapabilitiesRequestParamsTransformer } from "./capabilities-request-params-transformer/GenericCapabilitiesRequestParamsTransformer";
import { GenericCapabilitiesResponseDataExtractor } from "./capabilities-response-data-extractor/GenericCapabilitiesResponseDataExtractor";
import { CapabilitiesSectionExtractorFactory } from "./capabilities-response-data-extractor/CapabilitiesSectionExtractorFactory";
import { KeywordsExtractorFactory } from "./capabilities-response-data-extractor/KeywordsExtractorFactory";
import { LayerAttributionExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerAttributionExtractorFactory";
import { LayerAuthorityUrlsExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerAuthorityUrlsExtractorFactory";
import { LayerBoundingBoxesExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerBoundingBoxesExtractorFactory";
import { LayerCrsExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerCrsExtractorFactory";
import { LayerIdentifiersExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerIdentifiersExtractorFactory";
import { LayerMetadataUrlsExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerMetadataUrlsExtractorFactory";
import { LayerResourceUrlsExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerResourceUrlsExtractorFactory";
import { LayersExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayersExtractorFactory";
import { LayerStylesExtractorFactory } from "./capabilities-response-data-extractor/layers-data-extractor/LayerStylesExtractorFactory";
import { ServiceSectionExtractorFactory } from "./capabilities-response-data-extractor/ServiceSectionExtractorFactory";
import { UpdateSequenceExtractorFactory } from "./capabilities-response-data-extractor/UpdateSequenceExtractorFactory";
import { VersionExtractorFactory } from "./capabilities-response-data-extractor/VersionExtractorFactory";
import { ErrorsExtractor } from "./errors-extractor/ErrorsExtractor";
import { MapRequestParamsTransformer_1_3_0 } from "./map-request-params-transformer/MapRequestParamsTransformer_1_3_0";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";

export const versionAdapterContainerModule_1_3_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.3.0";
    const rootNodeName = "wms:WMS_Capabilities";
    const namespace = "wms";

    container.implement(
      "WmsVersionAdapter",
      BaseWmsVersionAdapter,
      [
        constant("1.3.0"),
        { service: "WmsCapabilitiesRequestParamsTransformer", name },
        { service: "WmsCapabilitiesResponseDataExtractor", name },
        { service: "WmsMapRequestParamsTransformer", name },
        { service: "WmsErrorsExtractor", name },
      ],
      { name }
    );

    // GetCapabilities request params transformer v1.3.0
    container.implement(
      "WmsCapabilitiesRequestParamsTransformer",
      GenericCapabilitiesRequestParamsTransformer,
      [constant(name)],
      { name }
    );

    // Keywords extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Keyword[]>",
      KeywordsExtractorFactory,
      [constant(namespace)],
      { name }
    );

    // Version extractor v1.3.0
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[version]>",
      VersionExtractorFactory,
      [constant(rootNodeName)],
      { name }
    );

    // UpdateSequence extractor v1.3.0
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[updateSequence]>",
      UpdateSequenceExtractorFactory,
      [constant(rootNodeName)],
      { name }
    );

    // Service section extractor v1.3.0
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      ServiceSectionExtractorFactory,
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
      LayerCrsExtractorFactory,
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
      LayerBoundingBoxesExtractorFactory,
      [constant("CRS"), constant("wms")],
      { name }
    );

    // Layer attribution extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[attribution]>",
      LayerAttributionExtractorFactory,
      [constant("wms")],
      { name }
    );

    // Layer authority URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[authorityUrls]>",
      LayerAuthorityUrlsExtractorFactory,
      [constant("wms")],
      { name }
    );

    // Layer identifiers extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[identifiers]>",
      LayerIdentifiersExtractorFactory,
      [constant("wms")],
      { name }
    );

    // Layer metadata URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[metadataUrls]>",
      LayerMetadataUrlsExtractorFactory,
      [constant("wms")],
      { name }
    );

    // Layer data URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[dataUrls]>",
      LayerResourceUrlsExtractorFactory,
      [constant("DataURL"), constant("wms")],
      { name }
    );

    // Layer feature list URLs extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[featureListUrls]>",
      LayerResourceUrlsExtractorFactory,
      [constant("FeatureListURL"), constant("wms")],
      { name }
    );

    // Layer styles extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[styles]>",
      LayerStylesExtractorFactory,
      [constant("wms")],
      { name }
    );

    // Layers data extractor v1.3.0
    container.implement(
      "XmlDataExtractor<Layer[]>",
      LayersExtractorFactory,
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
      CapabilitiesSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Layer[]>", name },
        { service: "XmlDataExtractor<ExceptionFormat[]>", name },
        constant("wms:WMS_Capabilities"),
        constant("wms"),
      ],
      { name }
    );

    container.implement(
      "WmsCapabilitiesResponseDataExtractor",
      GenericCapabilitiesResponseDataExtractor,
      [
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[version]>",
          name,
        },
        {
          service:
            "XmlDataExtractor<UnifiedCapabilitiesResponse[updateSequence]>",
          name,
        },
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
          name,
        },
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
          name,
        },
        constant({
          xlink: "http://www.w3.org/1999/xlink",
          wms: "http://www.opengis.net/wms",
        }),
      ],
      { name }
    );

    container.implement(
      "WmsMapRequestParamsTransformer",
      MapRequestParamsTransformer_1_3_0,
      [],
      { name }
    );

    container.implement(
      "WmsErrorsExtractor",
      ErrorsExtractor,
      [constant("ogc")],
      { name }
    );
  },
};
