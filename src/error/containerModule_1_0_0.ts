import type { ServiceContainer, ServiceModule } from "../service-container";
import type { TypesMap } from "../TypesMap";
import { ExceptionReportExtractor_1_0 } from "./ExceptionReportExtractor_1_0";

export const containerModule_1_0_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "ExceptionReportExtractor",
      ExceptionReportExtractor_1_0,
      [],
      { name: "1.0.0" }
    );
  },
};
