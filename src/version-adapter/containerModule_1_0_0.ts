import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { containerModule_1_0 as capabilitiesResponseExtractorModule } from "./capabilities-response-data-extractor/containerModule_1_0";

export const containerModule_1_0_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    // CapabilitiesResponseDataExtractor module
    container.registerModule(capabilitiesResponseExtractorModule);
  },
};
