import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../TypesMap";
import { GenericMapRequestParamsTransformer } from "./GenericMapRequestParamsTransformer";

/**
 * Service module of container registrations, related to GetMap request params transformer for WMS v1.1.
 */
export const containerModule_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "MapRequestParamsTransformer",
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.1.1")],
      { name: "1.1.1" }
    );
  },
};
