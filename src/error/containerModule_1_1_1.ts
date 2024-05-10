import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../TypesMap";
import { GenericExceptionReportExtractor } from "./GenericExceptionReportExtractor";

/**
 * Service module for container registrations, related to errors for WMS v1.1.1.
 */
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
