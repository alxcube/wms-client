import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { CapabilitiesResponseDataExtractor } from "./1.1.1/CapabilitiesResponseDataExtractor";

export const versionAdapterContainerModule_1_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.registerClass(CapabilitiesResponseDataExtractor, []);
    container.registerImplementation(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
      { name: "1.1.1" }
    );
  },
};
