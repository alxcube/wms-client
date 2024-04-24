import { constant } from "../../service-container";
import type { ServiceContainer, ServiceModule } from "../../service-container";
import type { TypesMap } from "../../TypesMap";
import { GenericCapabilitiesRequestParamsTransformer } from "./GenericCapabilitiesRequestParamsTransformer";

export const containerModule_1_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "CapabilitiesRequestParamsTransformer",
      GenericCapabilitiesRequestParamsTransformer,
      ["VersionComparator", constant("1.0.0")],
      { name: "1.0.0" }
    );
  },
};
