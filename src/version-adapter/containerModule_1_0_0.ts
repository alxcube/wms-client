import { constant } from "../service-container";
import type { ServiceContainer, ServiceModule } from "../service-container";
import type { TypesMap } from "../TypesMap";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";
import { containerModule_1_0 as capabilitiesRequestParamsTransformerModule } from "./capabilities-request-params-transformer/containerModule_1_0";
import { containerModule_1_0 as capabilitiesResponseExtractorModule } from "./capabilities-response-data-extractor/containerModule_1_0";
import { containerModule_1_0 as mapRequestParamsTransformerModule } from "./map-request-params-transformer/containerModule_1_0";
import { containerModule_1_0 as featureInfoRequestParamsTransformerModule } from "./feature-info-request-params-transformer/containerModule_1_0";
import { containerModule_1_0 as versionCompatibilityCheckerModule } from "./version-compatibility-checker/containerModule_1_0";

export const containerModule_1_0_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.0.0";

    container.implement(
      "WmsVersionAdapter",
      BaseWmsVersionAdapter,
      [
        constant("1.0.0"),
        { service: "CapabilitiesRequestParamsTransformer", name },
        { service: "CapabilitiesResponseDataExtractor", name },
        { service: "MapRequestParamsTransformer", name },
        { service: "FeatureInfoRequestParamsTransformer", name },
        { service: "VersionCompatibilityChecker", name },
      ],
      { name }
    );

    // CapabilitiesRequestParamsTransformer module
    container.registerModule(capabilitiesRequestParamsTransformerModule);

    // CapabilitiesResponseDataExtractor module
    container.registerModule(capabilitiesResponseExtractorModule);

    // MapRequestParamsTransformer module
    container.registerModule(mapRequestParamsTransformerModule);

    // FeatureInfoRequestParamsTransformer module
    container.registerModule(featureInfoRequestParamsTransformerModule);

    // VersionCompatibilityChecker module
    container.registerModule(versionCompatibilityCheckerModule);
  },
};
