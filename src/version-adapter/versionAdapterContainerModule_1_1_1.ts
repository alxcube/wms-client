import { map } from "@alxcube/xml-mapper";
import type { ExceptionFormat } from "../ExceptionFormat";
import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { CapabilitiesSectionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/CapabilitiesSectionExtractorFactory";
import { CapabilitiesResponseDataExtractor } from "./1.1.1/capabilities-response-data-extractor/CapabilitiesResponseDataExtractor";
import { KeywordsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/KeywordsExtractorFactory";
import { LayerAttributionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerAttributionExtractorFactory";
import { LayerAuthorityUrlsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerAuthorityUrlsExtractorFactory";
import { LayerBoundingBoxesExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerBoundingBoxesExtractorFactory";
import { LayerCrsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerCrsExtractorFactory";
import { LayerDimensionsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerDimensionsExtractorFactory";
import { LayerGeographicBoundsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerGeographicBoundsExtractorFactory";
import { LayerIdentifiersExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerIdentifiersExtractorFactory";
import { LayerMetadataUrlsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerMetadataUrlsExtractorFactory";
import { LayerResourceUrlsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerResourceUrlsExtractorFactory";
import { LayersExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayersExtractorFactory";
import { LayerStylesExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerStylesExtractorFactory";
import { ServiceSectionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/ServiceSectionExtractorFactory";
import { UpdateSequenceExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/UpdateSequenceExtractorFactory";
import { VersionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/VersionExtractorFactory";

export const versionAdapterContainerModule_1_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.1.1";
    const rootNodeName = "WMT_MS_Capabilities";

    // Keywords extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Keyword[]>",
      KeywordsExtractorFactory,
      [constant("")],
      { name }
    );

    // Version extractor v1.1.1
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[version]>",
      VersionExtractorFactory,
      [constant(rootNodeName)],
      { name }
    );

    // UpdateSequence extractor v1.1.1
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[updateSequence]>",
      UpdateSequenceExtractorFactory,
      [constant(rootNodeName)],
      { name }
    );

    // Service section extractor v1.1.1
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      ServiceSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        constant(rootNodeName),
        constant(""),
      ],
      { name }
    );

    // Layer CRS extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[crs]>",
      LayerCrsExtractorFactory,
      [constant("SRS")],
      { name }
    );

    // Layer dimensions extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[dimensions]>",
      LayerDimensionsExtractorFactory,
      [],
      { name }
    );

    // Layer geographic bounds extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[geographicBounds]>",
      LayerGeographicBoundsExtractorFactory,
      [],
      { name }
    );

    // Layer bounding boxes extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[boundingBoxes]>",
      LayerBoundingBoxesExtractorFactory,
      [constant("SRS"), constant("")],
      { name }
    );

    // Layer attribution extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[attribution]>",
      LayerAttributionExtractorFactory,
      [constant("")],
      { name }
    );

    // Layer authority URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[authorityUrls]>",
      LayerAuthorityUrlsExtractorFactory,
      [constant("")],
      { name }
    );

    // Layer identifiers extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[identifiers]>",
      LayerIdentifiersExtractorFactory,
      [constant("")],
      { name }
    );

    // Layer metadata URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[metadataUrls]>",
      LayerMetadataUrlsExtractorFactory,
      [constant("")],
      { name }
    );

    // Layer data URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[dataUrls]>",
      LayerResourceUrlsExtractorFactory,
      [constant("DataURL"), constant("")],
      { name }
    );

    // Layer feature list URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[featureListUrls]>",
      LayerResourceUrlsExtractorFactory,
      [constant("FeatureListURL"), constant("")],
      { name }
    );

    // Layer styles extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[styles]>",
      LayerStylesExtractorFactory,
      [constant("")],
      { name }
    );

    // Layers data extractor v1.1.1
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
        constant(""),
      ],
      { name }
    );

    // Exception formats extractor v1.1.1
    container.registerConstant(
      "XmlDataExtractor<ExceptionFormat[]>",
      map()
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
      { name }
    );

    // Capability section extractor v1.1.1
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
      CapabilitiesSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Layer[]>", name },
        { service: "XmlDataExtractor<ExceptionFormat[]>", name },
        constant(rootNodeName),
        constant(""),
      ],
      { name }
    );

    // Capabilities response extractor v1.1.1
    // TODO: remove registerClass() (should update test)
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
      constant({
        xlink: "http://www.w3.org/1999/xlink",
      }),
    ]);
    container.implement(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
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
        }),
      ],
      { name }
    );
  },
};
