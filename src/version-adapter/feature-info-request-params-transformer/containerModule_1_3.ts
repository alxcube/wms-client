import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../TypesMap";
import { GenericFeatureInfoRequestParamsTransformer } from "./GenericFeatureInfoRequestParamsTransformer";

/**
 * Service module of container registrations, related to GetFeatureInfo request params transformer for WMS v1.3.
 */
export const containerModule_1_3: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "FeatureInfoRequestParamsTransformer",
      GenericFeatureInfoRequestParamsTransformer,
      [
        { service: "MapRequestParamsTransformer", name: "1.3.0" },
        "VersionComparator",
        constant("1.3.0"),
      ],
      { name: "1.3.0" }
    );
  },
};
