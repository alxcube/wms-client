import { constant } from "../../service-container";
import type { ServiceContainer, ServiceModule } from "../../service-container";
import type { TypesMap } from "../../TypesMap";
import { GenericCapabilitiesRequestParamsTransformer } from "./GenericCapabilitiesRequestParamsTransformer";

export const containerModule_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "CapabilitiesRequestParamsTransformer",
      GenericCapabilitiesRequestParamsTransformer,
      ["VersionComparator", constant("1.1.1")],
      { name: "1.1.1" }
    );
  },
};
