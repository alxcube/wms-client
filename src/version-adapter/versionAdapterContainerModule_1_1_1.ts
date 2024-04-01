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

    // Keywords extractor
    container.registerClass(KeywordsExtractorFactory, [], { name });
    container.registerImplementation(
      "XmlDataExtractor<Keyword[]>",
      { service: KeywordsExtractorFactory, name },
      { name }
    );

    // Version extractor v1.1.1
    container.registerClass(VersionExtractorFactory, [], { name });
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[version]>",
      { service: VersionExtractorFactory, name },
      { name }
    );

    // UpdateSequence extractor v1.1.1
    container.registerClass(UpdateSequenceExtractorFactory, [], { name });
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[updateSequence]>",
      { service: UpdateSequenceExtractorFactory, name },
      { name }
    );

    // Service section extractor v1.1.1
    container.registerClass(
      ServiceSectionExtractorFactory,
      [{ service: "XmlDataExtractor<Keyword[]>", name }],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      { service: ServiceSectionExtractorFactory, name },
      { name }
    );

    // Layer CRS extractor v1.1.1
    container.registerClass(LayerCrsExtractorFactory, [], { name });
    container.registerImplementation(
      "XmlDataExtractor<Layer[crs]>",
      { service: LayerCrsExtractorFactory, name },
      { name }
    );

    // Layer dimensions extractor v1.1.1
    container.registerClass(LayerDimensionsExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[dimensions]>",
      LayerDimensionsExtractorFactory,
      { name }
    );

    // Layer geographic bounds extractor v1.1.1
    container.registerClass(LayerGeographicBoundsExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[geographicBounds]>",
      LayerGeographicBoundsExtractorFactory,
      { name }
    );

    // Layer bounding boxes extractor v1.1.1
    container.registerClass(LayerBoundingBoxesExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[boundingBoxes]>",
      LayerBoundingBoxesExtractorFactory,
      { name }
    );

    // Layer attribution extractor v1.1.1
    container.registerClass(LayerAttributionExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[attribution]>",
      LayerAttributionExtractorFactory,
      { name }
    );

    // Layer authority URLs extractor v1.1.1
    container.registerClass(LayerAuthorityUrlsExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[authorityUrls]>",
      LayerAuthorityUrlsExtractorFactory,
      { name }
    );

    // Layer identifiers extractor v1.1.1
    container.registerClass(LayerIdentifiersExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[identifiers]>",
      LayerIdentifiersExtractorFactory,
      { name }
    );

    // Layer metadata URLs extractor v1.1.1
    container.registerClass(LayerMetadataUrlsExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[metadataUrls]>",
      LayerMetadataUrlsExtractorFactory,
      { name }
    );

    // Layer data URLs extractor v1.1.1
    container.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("DataURL")],
      { name: "LayerDataUrlsExtractor_1.1.1" }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[dataUrls]>",
      {
        service: LayerResourceUrlsExtractorFactory,
        name: "LayerDataUrlsExtractor_1.1.1",
      },
      { name }
    );

    // Layer feature list URLs extractor v1.1.1
    container.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("FeatureListURL")],
      { name: "LayerFeatureListUrlsExtractor_1.1.1" }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[featureListUrls]>",
      {
        service: LayerResourceUrlsExtractorFactory,
        name: "LayerFeatureListUrlsExtractor_1.1.1",
      },
      { name }
    );

    // Layer styles extractor v1.1.1
    container.registerClass(LayerStylesExtractorFactory, []);
    container.registerImplementation(
      "XmlDataExtractor<Layer[styles]>",
      LayerStylesExtractorFactory,
      { name }
    );

    // Layers data extractor v1.1.1
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
      ],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<Layer[]>",
      { service: LayersExtractorFactory, name },
      { name }
    );

    // Capability section extractor v1.1.1
    container.registerClass(
      CapabilitiesSectionExtractorFactory,
      [{ service: "XmlDataExtractor<Layer[]>", name }],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
      { service: CapabilitiesSectionExtractorFactory, name },
      { name }
    );

    // Capabilities response extractor v1.1.1
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
    container.registerImplementation(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
      { name }
    );
  },
};
