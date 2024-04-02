import { map } from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../ExceptionFormat";
import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { CapabilitiesSectionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/CapabilitiesSectionExtractorFactory";
import { KeywordsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/KeywordsExtractorFactory";
import { LayerAttributionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerAttributionExtractorFactory";
import { LayerAuthorityUrlsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerAuthorityUrlsExtractorFactory";
import { LayerBoundingBoxesExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerBoundingBoxesExtractorFactory";
import { LayerCrsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerCrsExtractorFactory";
import { LayerIdentifiersExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerIdentifiersExtractorFactory";
import { LayerMetadataUrlsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerMetadataUrlsExtractorFactory";
import { LayerResourceUrlsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerResourceUrlsExtractorFactory";
import { LayersExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayersExtractorFactory";
import { LayerStylesExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerStylesExtractorFactory";
import { ServiceSectionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/ServiceSectionExtractorFactory";
import { UpdateSequenceExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/UpdateSequenceExtractorFactory";
import { VersionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/VersionExtractorFactory";
import { capabilitiesRequestParamsTransformer } from "./1.3.0/capabilitiesRequestParamsTransformer";
import { CapabilitiesResponseDataExtractor } from "./1.3.0/capabilities-response-data-extractor/CapabilitiesResponseDataExtractor";
import { ErrorsExtractor } from "./1.3.0/ErrorsExtractor";
import { MapRequestParamsTransformer } from "./1.3.0/MapRequestParamsTransformer";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";

export const versionAdapterContainerModule_1_3_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.3.0";
    const rootNodeName = "wms:WMS_Capabilities";
    const namespace = "wms";

    container.registerClass(
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
    container.registerImplementation(
      "WmsVersionAdapter",
      { service: BaseWmsVersionAdapter, name },
      { name }
    );

    container.registerConstant(
      "WmsCapabilitiesRequestParamsTransformer",
      capabilitiesRequestParamsTransformer,
      { name }
    );

    // Keywords extractor v1.1.1
    container.registerClass(KeywordsExtractorFactory, [constant(namespace)], {
      name,
    });
    container.registerImplementation(
      "XmlDataExtractor<Keyword[]>",
      { service: KeywordsExtractorFactory, name },
      { name }
    );

    // Version extractor v1.3.0
    container.registerClass(VersionExtractorFactory, [constant(rootNodeName)], {
      name,
    });
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[version]>",
      { service: VersionExtractorFactory, name },
      { name }
    );

    // UpdateSequence extractor v1.3.0
    container.registerClass(
      UpdateSequenceExtractorFactory,
      [constant(rootNodeName)],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[updateSequence]>",
      { service: UpdateSequenceExtractorFactory, name },
      { name }
    );

    // Service section extractor v1.3.0
    container.registerClass(
      ServiceSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        constant(rootNodeName),
        constant(namespace),
      ],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      { service: ServiceSectionExtractorFactory, name },
      { name }
    );

    // Layer CRS extractor v1.3.0
    container.registerClass(LayerCrsExtractorFactory, [constant("wms:CRS")], {
      name,
    });
    container.registerImplementation(
      "XmlDataExtractor<Layer[crs]>",
      { service: LayerCrsExtractorFactory, name },
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
    container.registerClass(
      LayerBoundingBoxesExtractorFactory,
      [constant("CRS"), constant("wms")],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[boundingBoxes]>",
      { service: LayerBoundingBoxesExtractorFactory, name },
      { name }
    );

    // Layer attribution extractor v1.3.0
    container.registerClass(
      LayerAttributionExtractorFactory,
      [constant("wms")],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[attribution]>",
      { service: LayerAttributionExtractorFactory, name },
      { name }
    );

    // Layer authority URLs extractor v1.3.0
    container.registerClass(
      LayerAuthorityUrlsExtractorFactory,
      [constant("wms")],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[authorityUrls]>",
      { service: LayerAuthorityUrlsExtractorFactory, name },
      { name }
    );

    // Layer identifiers extractor v1.3.0
    container.registerClass(
      LayerIdentifiersExtractorFactory,
      [constant("wms")],
      {
        name,
      }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[identifiers]>",
      { service: LayerIdentifiersExtractorFactory, name },
      { name }
    );

    // Layer metadata URLs extractor v1.3.0
    container.registerClass(
      LayerMetadataUrlsExtractorFactory,
      [constant("wms")],
      {
        name,
      }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[metadataUrls]>",
      { service: LayerMetadataUrlsExtractorFactory, name },
      { name }
    );

    // Layer data URLs extractor v1.3.0
    container.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("DataURL"), constant("wms")],
      { name: "LayerDataUrlsExtractor_1.3.0" }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[dataUrls]>",
      {
        service: LayerResourceUrlsExtractorFactory,
        name: "LayerDataUrlsExtractor_1.3.0",
      },
      { name }
    );

    // Layer feature list URLs extractor v1.3.0
    container.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("FeatureListURL"), constant("wms")],
      { name: "LayerFeatureListUrlsExtractor_1.3.0" }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[featureListUrls]>",
      {
        service: LayerResourceUrlsExtractorFactory,
        name: "LayerFeatureListUrlsExtractor_1.3.0",
      },
      { name }
    );

    // Layer styles extractor v1.3.0
    container.registerClass(LayerStylesExtractorFactory, [constant("wms")], {
      name,
    });
    container.registerImplementation(
      "XmlDataExtractor<Layer[styles]>",
      { service: LayerStylesExtractorFactory, name },
      { name }
    );

    // Layers data extractor v1.3.0
    container.registerClass(
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
    container.registerImplementation(
      "XmlDataExtractor<Layer[]>",
      { service: LayersExtractorFactory, name },
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
    container.registerClass(
      CapabilitiesSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Layer[]>", name },
        { service: "XmlDataExtractor<ExceptionFormat[]>", name },
        constant("wms:WMS_Capabilities"),
        constant("wms"),
      ],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
      { service: CapabilitiesSectionExtractorFactory, name },
      { name }
    );

    container.registerClass(CapabilitiesResponseDataExtractor, [
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
    ]);
    container.registerImplementation(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
      { name }
    );

    container.registerClass(MapRequestParamsTransformer, []);
    container.registerImplementation(
      "WmsMapRequestParamsTransformer",
      MapRequestParamsTransformer,
      { name }
    );

    container.registerClass(ErrorsExtractor, []);
    container.registerImplementation("WmsErrorsExtractor", ErrorsExtractor, {
      name,
    });
  },
};
