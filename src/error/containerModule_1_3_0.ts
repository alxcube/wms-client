import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../TypesMap";
import { GenericExceptionReportExtractor } from "./GenericExceptionReportExtractor";

/**
 * Service module for container registrations, related to errors for WMS v1.3.0.
 */
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
