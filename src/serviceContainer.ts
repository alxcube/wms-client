import { BaseRequestErrorHandler, BaseWmsClientFactory } from "./client";
import { BaseWmsNegotiator } from "./negotiator";
import { BaseWmsXmlParser } from "./wms-xml-parser";
import {
  BaseXmlResponseVersionExtractor,
  BaseWmsVersionAdapterResolver,
} from "./version-adapter";
import { BaseExceptionXmlChecker } from "./error";
import { BaseQueryParamsSerializer } from "./query-params-serializer";
import { Container } from "./service-container";
import type { TypesMap } from "./TypesMap";
import { containerModule_1_0_0 as versionAdapterModule_1_0_0 } from "./version-adapter/containerModule_1_0_0";
import { containerModule_1_1_1 as versionAdapterModule_1_1_1 } from "./version-adapter/containerModule_1_1_1";
import { containerModule_1_3_0 as versionAdapterModule_1_3_0 } from "./version-adapter/containerModule_1_3_0";
import { BaseVersionComparator } from "./version-comparator";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { containerModule_1_1_1 as exceptionModule_1_1_1 } from "./error/containerModule_1_1_1";
import { containerModule_1_3_0 as exceptionModule_1_3_0 } from "./error/containerModule_1_3_0";
import { containerModule_1_0_0 as exceptionModule_1_0_0 } from "./error/containerModule_1_0_0";

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

serviceContainer.createArrayResolver(
  "WmsVersionAdapter",
  "WmsVersionAdapter[]"
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

serviceContainer.createArrayResolver(
  "ExceptionReportExtractor",
  "ExceptionReportExtractor[]"
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
  "QueryParamsSerializer",
]);

serviceContainer.registerModule(versionAdapterModule_1_0_0);
serviceContainer.registerModule(versionAdapterModule_1_1_1);
serviceContainer.registerModule(versionAdapterModule_1_3_0);
serviceContainer.registerModule(exceptionModule_1_0_0);
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
