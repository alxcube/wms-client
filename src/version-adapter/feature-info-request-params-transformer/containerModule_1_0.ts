import { constant } from "../../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../../service-container/ServiceContainer";
import type { TypesMap } from "../../TypesMap";
import { GenericFeatureInfoRequestParamsTransformer } from "./GenericFeatureInfoRequestParamsTransformer";

export const containerModule_1_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "FeatureInfoRequestParamsTransformer",
      GenericFeatureInfoRequestParamsTransformer,
      [
        { service: "MapRequestParamsTransformer", name: "1.0.0" },
        "VersionComparator",
        constant("1.0.0"),
      ],
      { name: "1.0.0" }
    );
  },
};