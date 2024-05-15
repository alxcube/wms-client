import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../TypesMap";
import { CapabilitiesSectionExtractor_1_0 } from "./CapabilitiesSectionExtractor_1_0";
import { GenericCapabilitiesResponseDataExtractor } from "./GenericCapabilitiesResponseDataExtractor";
import { keywordsExtractor_1_0 } from "./keywordsExtractor_1_0";
import { containerModule_1_0 as layersExtractorModule } from "./layers-data-extractor/containerModule_1_0";
import { ServiceSectionExtractor_1_0 } from "./ServiceSectionExtractor_1_0";

/**
 * Service module for container registrations, related to `UnifiedCapabilitiesResponse` data extraction for WMS v1.0.
 */
export const containerModule_1_0: ServiceModule<TypesMap> = {
  // Layer[] extractor module
  register(container: ServiceContainer<TypesMap>) {
    // Name corresponds to version implementation. Used to distinguish between implementations of common interfaces
    // for specific WMS versions.
    const name = "1.0.0";

    // XML namespaces for performing xpath lookup
    const namespaces = constant({});

    // Keyword[] extractor
    container.registerConstant(
      "XmlDataExtractor<Keyword[]>",
      keywordsExtractor_1_0,
      { name }
    );

    // UnifiedCapabilitiesResponse extractor
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
        namespaces,
      ],
      { name }
    );

    // UnifiedCapabilitiesResponse["service"] extractor
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      ServiceSectionExtractor_1_0,
      [{ service: "XmlDataExtractor<Keyword[]>", name }],
      { name }
    );

    // UnifiedCapabilitiesResponse["capability"] extractor
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
      CapabilitiesSectionExtractor_1_0,
      [{ service: "XmlDataExtractor<Layer[]>", name }],
      { name }
    );

    container.loadModule(layersExtractorModule);
  },
};
