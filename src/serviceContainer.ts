import { BaseWmsClientFactory } from "./BaseWmsClientFactory";
import { BaseWmsNegotiator } from "./BaseWmsNegotiator";
import { BaseXmlResponseVersionExtractor } from "./BaseXmlResponseVersionExtractor";
import { BaseExceptionXmlChecker } from "./error/BaseExceptionXmlChecker";
import { BaseQueryParamsSerializer } from "./query-params-serializer/BaseQueryParamsSerializer";
import { Container } from "./service-container/Container";
import type { TypesMap } from "./TypesMap";
import { BaseWmsVersionAdapterResolver } from "./version-adapter/version-adapter-resolver/BaseWmsVersionAdapterResolver";
import { versionAdapterContainerModule_1_1_1 } from "./version-adapter/versionAdapterContainerModule_1_1_1";
import { versionAdapterContainerModule_1_3_0 } from "./version-adapter/versionAdapterContainerModule_1_3_0";
import { BaseVersionComparator } from "./version-comparator/BaseVersionComparator";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

export const serviceContainer = new Container<TypesMap>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
serviceContainer.implement("DOMParser", DOMParser, [] as any);

serviceContainer.implement("WmsClientFactory", BaseWmsClientFactory, [
  "WmsVersionAdapterResolver",
  "QueryParamsSerializer",
  "ExceptionXmlChecker",
]);

serviceContainer.implement(
  "QueryParamsSerializer",
  BaseQueryParamsSerializer,
  []
);

serviceContainer.implement("VersionComparator", BaseVersionComparator, []);

serviceContainer.registerFactory("WmsVersionAdapter[]", (context) =>
  context.resolveAll("WmsVersionAdapter")
);

serviceContainer.implement(
  "WmsVersionAdapterResolver",
  BaseWmsVersionAdapterResolver,
  ["WmsVersionAdapter[]"]
);

serviceContainer.implement(
  "XmlResponseVersionExtractor",
  BaseXmlResponseVersionExtractor,
  []
);

serviceContainer.registerFactory("ExceptionReportExtractor[]", (context) =>
  context.resolveAll("ExceptionReportExtractor")
);

serviceContainer.implement("XMLSerializer", XMLSerializer, []);

serviceContainer.implement("ExceptionXmlChecker", BaseExceptionXmlChecker, [
  "ExceptionReportExtractor[]",
  "XMLSerializer",
]);

serviceContainer.implement("WmsNegotiator", BaseWmsNegotiator, [
  "WmsVersionAdapter[]",
  "VersionComparator",
  "DOMParser",
  "XmlResponseVersionExtractor",
  "WmsClientFactory",
]);

serviceContainer.registerModule(versionAdapterContainerModule_1_1_1);
serviceContainer.registerModule(versionAdapterContainerModule_1_3_0);
