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
import { LayersExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayersExtractorFactory";
import { LayerStylesExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/LayerStylesExtractorFactory";
import { ResourceUrlsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/layers-data-extractor/ResourceUrlsExtractorFactory";
import { ServiceSectionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/ServiceSectionExtractorFactory";

export const versionAdapterContainerModule_1_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.registerClass(LayerCrsExtractorFactory, []);
    container.registerClass(LayerGeographicBoundsExtractorFactory, []);
    container.registerClass(LayerBoundingBoxesExtractorFactory, []);
    container.registerClass(LayerAttributionExtractorFactory, []);
    container.registerClass(LayerAuthorityUrlsExtractorFactory, []);
    container.registerClass(LayerIdentifiersExtractorFactory, []);
    container.registerClass(LayerMetadataUrlsExtractorFactory, []);
    container.registerClass(ResourceUrlsExtractorFactory, []);
    container.registerClass(LayerStylesExtractorFactory, []);
    container.registerClass(LayersExtractorFactory, [
      KeywordsExtractorFactory,
      LayerCrsExtractorFactory,
      LayerDimensionsExtractorFactory,
      LayerGeographicBoundsExtractorFactory,
      LayerBoundingBoxesExtractorFactory,
      LayerAttributionExtractorFactory,
      LayerAuthorityUrlsExtractorFactory,
      LayerIdentifiersExtractorFactory,
      LayerMetadataUrlsExtractorFactory,
      ResourceUrlsExtractorFactory,
      LayerStylesExtractorFactory,
    ]);
    container.registerClass(CapabilitiesSectionExtractorFactory, [
      LayersExtractorFactory,
    ]);
    container.registerClass(KeywordsExtractorFactory, []);
    container.registerClass(LayerDimensionsExtractorFactory, []);
    container.registerClass(ServiceSectionExtractorFactory, [
      KeywordsExtractorFactory,
    ]);

    container.registerClass(CapabilitiesResponseDataExtractor, [
      ServiceSectionExtractorFactory,
      CapabilitiesSectionExtractorFactory,
    ]);
    container.registerImplementation(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
      { name: "1.1.1" }
    );
  },
};
