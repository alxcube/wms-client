import { map } from "@alxcube/xml-mapper";
import { GenericExceptionReportExtractor } from "../error/GenericExceptionReportExtractor";
import type { ExceptionFormat } from "../ExceptionFormat";
import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";
import { GenericCapabilitiesRequestParamsTransformer } from "./capabilities-request-params-transformer/GenericCapabilitiesRequestParamsTransformer";
import { CapabilitiesSectionExtractor } from "./capabilities-response-data-extractor/CapabilitiesSectionExtractor";
import { GenericCapabilitiesResponseDataExtractor } from "./capabilities-response-data-extractor/GenericCapabilitiesResponseDataExtractor";
import { KeywordsExtractor } from "./capabilities-response-data-extractor/KeywordsExtractor";
import { AttributionExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/AttributionExtractor";
import { AuthorityUrlsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/AuthorityUrlsExtractor";
import { BoundingBoxesExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/BoundingBoxesExtractor";
import { CrsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/CrsExtractor";
import { DimensionsExtractor_1_1 } from "./capabilities-response-data-extractor/layers-data-extractor/DimensionsExtractor_1_1";
import { geographicBoundsExtractor_1_1 } from "./capabilities-response-data-extractor/layers-data-extractor/geographicBoundsExtractor_1_1";
import { IdentifiersExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/IdentifiersExtractor";
import { MetadataUrlsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/MetadataUrlsExtractor";
import { ResourceUrlsExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/ResourceUrlsExtractor";
import { LayersExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/LayersExtractor";
import { StylesExtractor } from "./capabilities-response-data-extractor/layers-data-extractor/StylesExtractor";
import { ServiceSectionExtractor } from "./capabilities-response-data-extractor/ServiceSectionExtractor";
import { xlinkXmlNamespace } from "./capabilities-response-data-extractor/xlinkXmlNamespace";
import { GenericMapRequestParamsTransformer } from "./map-request-params-transformer/GenericMapRequestParamsTransformer";
import { RangeVersionCompatibilityChecker } from "./version-compatibility-checker/RangeVersionCompatibilityChecker";

export const versionAdapterContainerModule_1_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.1.1";
    const rootNodeName = "WMT_MS_Capabilities";

    container.implement(
      "VersionCompatibilityChecker",
      RangeVersionCompatibilityChecker,
      ["VersionComparator", constant("1.1"), constant("1.2")],
      { name }
    );

    container.implement(
      "WmsVersionAdapter",
      BaseWmsVersionAdapter,
      [
        constant("1.1.1"),
        { service: "WmsCapabilitiesRequestParamsTransformer", name },
        { service: "WmsCapabilitiesResponseDataExtractor", name },
        { service: "WmsMapRequestParamsTransformer", name },
        { service: "VersionCompatibilityChecker", name },
      ],
      { name }
    );

    // GetCapabilities request params transformer v1.1.1
    container.implement(
      "WmsCapabilitiesRequestParamsTransformer",
      GenericCapabilitiesRequestParamsTransformer,
      [constant(name)],
      { name }
    );

    // Keywords extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Keyword[]>",
      KeywordsExtractor,
      [constant("")],
      { name }
    );

    // Service section extractor v1.1.1
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      ServiceSectionExtractor,
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
      CrsExtractor,
      [constant("SRS")],
      { name }
    );

    // Layer dimensions extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[dimensions]>",
      DimensionsExtractor_1_1,
      [],
      { name }
    );

    // Layer geographic bounds extractor v1.1.1
    container.registerConstant(
      "XmlDataExtractor<Layer[geographicBounds]>",
      geographicBoundsExtractor_1_1,
      { name }
    );

    // Layer bounding boxes extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[boundingBoxes]>",
      BoundingBoxesExtractor,
      [constant("SRS"), constant("")],
      { name }
    );

    // Layer attribution extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[attribution]>",
      AttributionExtractor,
      [constant("")],
      { name }
    );

    // Layer authority URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[authorityUrls]>",
      AuthorityUrlsExtractor,
      [constant("")],
      { name }
    );

    // Layer identifiers extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[identifiers]>",
      IdentifiersExtractor,
      [constant("")],
      { name }
    );

    // Layer metadata URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[metadataUrls]>",
      MetadataUrlsExtractor,
      [constant("")],
      { name }
    );

    // Layer data URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[dataUrls]>",
      ResourceUrlsExtractor,
      [constant("DataURL"), constant("")],
      { name }
    );

    // Layer feature list URLs extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[featureListUrls]>",
      ResourceUrlsExtractor,
      [constant("FeatureListURL"), constant("")],
      { name }
    );

    // Layer styles extractor v1.1.1
    container.implement(
      "XmlDataExtractor<Layer[styles]>",
      StylesExtractor,
      [constant("")],
      { name }
    );

    // Layers data extractor v1.1.1
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
      CapabilitiesSectionExtractor,
      [
        { service: "XmlDataExtractor<Layer[]>", name },
        { service: "XmlDataExtractor<ExceptionFormat[]>", name },
        constant(rootNodeName),
        constant(""),
      ],
      { name }
    );

    // Capabilities response extractor v1.1.1
    container.implement(
      "WmsCapabilitiesResponseDataExtractor",
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
        }),
      ],
      { name }
    );

    container.implement(
      "WmsMapRequestParamsTransformer",
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.1.1")],
      { name }
    );

    container.implement(
      "ExceptionReportExtractor",
      GenericExceptionReportExtractor,
      [
        "XmlResponseVersionExtractor",
        "VersionComparator",
        constant("1.1.0"),
        constant("1.2.0"),
        constant(""),
      ],
      { name }
    );
  },
};
