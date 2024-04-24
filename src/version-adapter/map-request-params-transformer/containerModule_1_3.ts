import { constant } from "../../service-container";
import type { ServiceContainer, ServiceModule } from "../../service-container";
import type { TypesMap } from "../../TypesMap";
import { GenericMapRequestParamsTransformer } from "./GenericMapRequestParamsTransformer";

export const containerModule_1_3: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "MapRequestParamsTransformer",
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.3.0")],
      { name: "1.3.0" }
    );
  },
};
