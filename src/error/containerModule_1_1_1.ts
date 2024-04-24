import { constant } from "../service-container";
import type { ServiceContainer, ServiceModule } from "../service-container";
import type { TypesMap } from "../TypesMap";
import { GenericExceptionReportExtractor } from "./GenericExceptionReportExtractor";

export const containerModule_1_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "ExceptionReportExtractor",
      GenericExceptionReportExtractor,
      [
        "XmlResponseVersionExtractor",
        "VersionComparator",
        constant("1.1.0"),
        constant("1.2.0"),
        constant(""),
      ],
      { name: "1.1.1" }
    );
  },
};
