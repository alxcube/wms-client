import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { GenericExceptionReportExtractor } from "./GenericExceptionReportExtractor";

export const containerModule_1_3_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.implement(
      "ExceptionReportExtractor",
      GenericExceptionReportExtractor,
      [
        "XmlResponseVersionExtractor",
        "VersionComparator",
        constant("1.3.0"),
        constant("1.4.0"),
        constant("ogc"),
      ],
      { name: "1.3.0" }
    );
  },
};
