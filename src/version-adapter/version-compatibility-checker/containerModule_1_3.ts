import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../TypesMap";
import { RangeVersionCompatibilityChecker } from "./RangeVersionCompatibilityChecker";

/**
 * Service module of container registrations of `VersionCompatibilityChecker` for WMS v1.3.
 */
export const containerModule_1_3: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const minVersion = constant("1.3");
    const maxVersion = constant("1.4");
    container.implement(
      "VersionCompatibilityChecker",
      RangeVersionCompatibilityChecker,
      ["VersionComparator", minVersion, maxVersion],
      { name: "1.3.0" }
    );
  },
};
