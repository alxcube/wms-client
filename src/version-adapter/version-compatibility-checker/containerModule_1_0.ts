import { constant } from "../../service-container";
import type { ServiceContainer, ServiceModule } from "../../service-container";
import type { TypesMap } from "../../TypesMap";
import { RangeVersionCompatibilityChecker } from "./RangeVersionCompatibilityChecker";

export const containerModule_1_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const minVersion = constant("1.0");
    const maxVersion = constant("1.1");
    container.implement(
      "VersionCompatibilityChecker",
      RangeVersionCompatibilityChecker,
      ["VersionComparator", minVersion, maxVersion],
      { name: "1.0.0" }
    );
  },
};
