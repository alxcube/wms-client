import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../TypesMap";
import { ExceptionReportExtractor_1_0 } from "./ExceptionReportExtractor_1_0";

/**
 * Service module for container registrations, related to errors for WMS v1.0.0.
 */
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
