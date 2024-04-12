import { BaseWmsClientFactory } from "./client/BaseWmsClientFactory";
import { BaseWmsNegotiator } from "./negotiator/BaseWmsNegotiator";
import { BaseXmlResponseVersionExtractor } from "./xml-response-version-extractor/BaseXmlResponseVersionExtractor";
import { BaseExceptionXmlChecker } from "./error/BaseExceptionXmlChecker";
import { BaseQueryParamsSerializer } from "./query-params-serializer/BaseQueryParamsSerializer";
import { Container } from "./service-container/Container";
import type { TypesMap } from "./TypesMap";
import { BaseWmsVersionAdapterResolver } from "./version-adapter/version-adapter-resolver/BaseWmsVersionAdapterResolver";
import { containerModule_1_1_1 as versionAdapterModule_1_1_1 } from "./version-adapter/containerModule_1_1_1";
import { containerModule_1_3_0 as versionAdapterModule_1_3_0 } from "./version-adapter/containerModule_1_3_0";
import { BaseVersionComparator } from "./version-comparator/BaseVersionComparator";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { containerModule_1_1_1 as exceptionModule_1_1_1 } from "./error/containerModule_1_1_1";
import { containerModule_1_3_0 as exceptionModule_1_3_0 } from "./error/containerModule_1_3_0";

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

serviceContainer.registerModule(versionAdapterModule_1_1_1);
serviceContainer.registerModule(versionAdapterModule_1_3_0);
serviceContainer.registerModule(exceptionModule_1_1_1);
serviceContainer.registerModule(exceptionModule_1_3_0);
