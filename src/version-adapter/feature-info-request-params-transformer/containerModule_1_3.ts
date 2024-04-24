import { constant } from "../../service-container";
import type { ServiceContainer, ServiceModule } from "../../service-container";
import type { TypesMap } from "../../TypesMap";
import { GenericFeatureInfoRequestParamsTransformer } from "./GenericFeatureInfoRequestParamsTransformer";

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
