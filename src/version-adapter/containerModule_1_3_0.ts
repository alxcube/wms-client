import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../TypesMap";
import { containerModule_1_3 as capabilitiesResponseExtractorModule } from "./capabilities-response-data-extractor/containerModule_1_3";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";
import { containerModule_1_3 as capabilitiesRequestParamsTransformerModule } from "./capabilities-request-params-transformer/containerModule_1_3";
import { containerModule_1_3 as mapRequestParamsTransformerModule } from "./map-request-params-transformer/containerModule_1_3";
import { containerModule_1_3 as versionCompatibilityCheckerModule } from "./version-compatibility-checker/containerModule_1_3";
import { containerModule_1_3 as featureInfoRequestParamsTransformerModule } from "./feature-info-request-params-transformer/containerModule_1_3";

/**
 * Service module of container registrations, related to WmsVersionAdapter for WMS v1.3.0.
 */
export const containerModule_1_3_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.3.0";

    container.implement(
      "WmsVersionAdapter",
      BaseWmsVersionAdapter,
      [
        constant("1.3.0"),
        { service: "CapabilitiesRequestParamsTransformer", name },
        { service: "CapabilitiesResponseDataExtractor", name },
        { service: "MapRequestParamsTransformer", name },
        { service: "FeatureInfoRequestParamsTransformer", name },
        { service: "VersionCompatibilityChecker", name },
      ],
      { name }
    );

    // CapabilitiesRequestParamsTransformer module
    container.loadModule(capabilitiesRequestParamsTransformerModule);

    // CapabilitiesResponseDataExtractor module
    container.loadModule(capabilitiesResponseExtractorModule);

    // MapRequestParamsTransformer module
    container.loadModule(mapRequestParamsTransformerModule);

    // FeatureInfoRequestParamsTransformer module
    container.loadModule(featureInfoRequestParamsTransformerModule);

    // VersionCompatibilityChecker module
    container.loadModule(versionCompatibilityCheckerModule);
  },
};
