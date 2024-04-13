import { BaseRequestErrorHandler } from "./client/BaseRequestErrorHandler";
import { BaseWmsClientFactory } from "./client/BaseWmsClientFactory";
import { BaseWmsNegotiator } from "./negotiator/BaseWmsNegotiator";
import { BaseWmsXmlParser } from "./wms-xml-parser/BaseWmsXmlParser";
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
  "WmsXmlParser",
  "RequestErrorHandler",
  "TextDecoder",
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
  ["WmsVersionAdapter[]", "VersionComparator"]
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
  "WmsXmlParser",
  "XmlResponseVersionExtractor",
  "WmsClientFactory",
  "WmsVersionAdapterResolver",
  "RequestErrorHandler",
  "VersionComparator",
]);

serviceContainer.registerModule(versionAdapterModule_1_1_1);
serviceContainer.registerModule(versionAdapterModule_1_3_0);
serviceContainer.registerModule(exceptionModule_1_1_1);
serviceContainer.registerModule(exceptionModule_1_3_0);

serviceContainer.implement("WmsXmlParser", BaseWmsXmlParser, [
  "DOMParser",
  "ExceptionXmlChecker",
]);

serviceContainer.implement("TextDecoder", TextDecoder, []);

serviceContainer.implement("RequestErrorHandler", BaseRequestErrorHandler, [
  "TextDecoder",
  "WmsXmlParser",
]);
