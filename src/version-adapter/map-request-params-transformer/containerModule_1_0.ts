import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../TypesMap";
import { GenericMapRequestParamsTransformer } from "./GenericMapRequestParamsTransformer";

/**
 * Service module of container registrations, related to GetMap request params transformer for WMS v1.0.
 */
export const containerModule_1_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "MapRequestParamsTransformer",
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.0.0")],
      { name: "1.0.0" }
    );
  },
};
