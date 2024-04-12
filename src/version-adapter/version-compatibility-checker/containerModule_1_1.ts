import { constant } from "../../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../../service-container/ServiceContainer";
import type { TypesMap } from "../../TypesMap";
import { RangeVersionCompatibilityChecker } from "./RangeVersionCompatibilityChecker";

export const containerModule_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const minVersion = constant("1.1");
    const maxVersion = constant("1.2");
    container.implement(
      "VersionCompatibilityChecker",
      RangeVersionCompatibilityChecker,
      ["VersionComparator", minVersion, maxVersion],
      { name: "1.1.1" }
    );
  },
};
