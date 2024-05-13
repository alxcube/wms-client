import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../TypesMap";
import { GenericCapabilitiesRequestParamsTransformer } from "./GenericCapabilitiesRequestParamsTransformer";

/**
 * Service module for container registrations, related to GetCapabilities request params transformer for WMS v1.3.0.
 */
export const containerModule_1_3: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "CapabilitiesRequestParamsTransformer",
      GenericCapabilitiesRequestParamsTransformer,
      ["VersionComparator", constant("1.3.0")],
      { name: "1.3.0" }
    );
  },
};
