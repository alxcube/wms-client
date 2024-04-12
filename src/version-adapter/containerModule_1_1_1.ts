import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";
import { containerModule_1_1 as capabilitiesResponseExtractorModule } from "./capabilities-response-data-extractor/containerModule_1_1";
import { containerModule_1_1 as capabilitiesRequestParamsTransformerModule } from "./capabilities-request-params-transformer/containerModule_1_1";
import { containerModule_1_1 as mapRequestParamsTransformerModule } from "./map-request-params-transformer/containerModule_1_1";
import { containerModule_1_1 as versionCompatibilityCheckerModule } from "./version-compatibility-checker/containerModule_1_1";

export const containerModule_1_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.1.1";

    container.implement(
      "WmsVersionAdapter",
      BaseWmsVersionAdapter,
      [
        constant("1.1.1"),
        { service: "CapabilitiesRequestParamsTransformer", name },
        { service: "CapabilitiesResponseDataExtractor", name },
        { service: "MapRequestParamsTransformer", name },
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

    // VersionCompatibilityChecker module
    container.registerModule(versionCompatibilityCheckerModule);
  },
};
