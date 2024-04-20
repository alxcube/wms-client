import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { containerModule_1_0 as capabilitiesRequestParamsTransformerModule } from "./capabilities-request-params-transformer/containerModule_1_0";
import { containerModule_1_0 as capabilitiesResponseExtractorModule } from "./capabilities-response-data-extractor/containerModule_1_0";
import { containerModule_1_0 as mapRequestParamsTransformerModule } from "./map-request-params-transformer/containerModule_1_0";
import { containerModule_1_0 as featureInfoRequestParamsTransformerModule } from "./feature-info-request-params-transformer/containerModule_1_0";

export const containerModule_1_0_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    // CapabilitiesRequestParamsTransformer module
    container.registerModule(capabilitiesRequestParamsTransformerModule);

    // CapabilitiesResponseDataExtractor module
    container.registerModule(capabilitiesResponseExtractorModule);

    // MapRequestParamsTransformer module
    container.registerModule(mapRequestParamsTransformerModule);

    // FeatureInfoRequestParamsTransformer module
    container.registerModule(featureInfoRequestParamsTransformerModule);
  },
};
