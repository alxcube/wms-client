import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { CapabilitiesExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/CapabilitiesExtractorFactory";
import { CapabilitiesResponseDataExtractor } from "./1.1.1/capabilities-response-data-extractor/CapabilitiesResponseDataExtractor";
import { KeywordsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/KeywordsExtractorFactory";
import { LayerDimensionsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/LayerDimensionsExtractorFactory";
import { ServiceDataExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/ServiceDataExtractorFactory";

export const versionAdapterContainerModule_1_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.registerClass(CapabilitiesExtractorFactory, [
      LayerDimensionsExtractorFactory,
      KeywordsExtractorFactory,
    ]);
    container.registerClass(KeywordsExtractorFactory, []);
    container.registerClass(LayerDimensionsExtractorFactory, []);
    container.registerClass(ServiceDataExtractorFactory, [
      KeywordsExtractorFactory,
    ]);

    container.registerClass(CapabilitiesResponseDataExtractor, [
      ServiceDataExtractorFactory,
      CapabilitiesExtractorFactory,
    ]);
    container.registerImplementation(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
      { name: "1.1.1" }
    );
  },
};
