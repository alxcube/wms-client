import { BaseWmsClientFactory } from "./BaseWmsClientFactory";
import { BaseQueryParamsSerializer } from "./query-params-serializer/BaseQueryParamsSerializer";
import { constant } from "./service-container/constant";
import { Container } from "./service-container/Container";
import type { TypesMap } from "./TypesMap";
import { capabilitiesRequestParamsTransformer } from "./version-adapter/1.3.0/capabilitiesRequestParamsTransformer";
import { CapabilitiesResponseDataExtractor } from "./version-adapter/1.3.0/CapabilitiesResponseDataExtractor";
import { ErrorsExtractor } from "./version-adapter/1.3.0/ErrorsExtractor";
import { MapRequestParamsTransformer } from "./version-adapter/1.3.0/MapRequestParamsTransformer";
import { BaseWmsVersionAdapter } from "./version-adapter/BaseWmsVersionAdapter";
import { BaseWmsVersionAdapterResolver } from "./version-adapter/BaseWmsVersionAdapterResolver";

export const serviceContainer = new Container<TypesMap>();

serviceContainer.registerClass(BaseWmsClientFactory, [
  "WmsVersionAdapterResolver",
  "QueryParamsSerializer",
]);
serviceContainer.registerImplementation(
  "WmsClientFactory",
  BaseWmsClientFactory
);

serviceContainer.registerClass(BaseQueryParamsSerializer, []);
serviceContainer.registerImplementation(
  "QueryParamsSerializer",
  BaseQueryParamsSerializer
);

serviceContainer.registerClass(
  BaseWmsVersionAdapter,
  [
    constant("1.3.0"),
    { service: "WmsCapabilitiesRequestParamsTransformer", name: "1.3.0" },
    { service: "WmsCapabilitiesResponseDataExtractor", name: "1.3.0" },
    { service: "WmsMapRequestParamsTransformer", name: "1.3.0" },
    { service: "WmsErrorsExtractor", name: "1.3.0" },
  ],
  { name: "1.3.0" }
);
serviceContainer.registerImplementation(
  "WmsVersionAdapter",
  { service: BaseWmsVersionAdapter, name: "1.3.0" },
  { name: "1.3.0" }
);

serviceContainer.registerConstant(
  "WmsCapabilitiesRequestParamsTransformer",
  capabilitiesRequestParamsTransformer,
  { name: "1.3.0" }
);

serviceContainer.registerClass(CapabilitiesResponseDataExtractor, []);
serviceContainer.registerImplementation(
  "WmsCapabilitiesResponseDataExtractor",
  CapabilitiesResponseDataExtractor,
  { name: "1.3.0" }
);

serviceContainer.registerClass(MapRequestParamsTransformer, []);
serviceContainer.registerImplementation(
  "WmsMapRequestParamsTransformer",
  MapRequestParamsTransformer,
  { name: "1.3.0" }
);

serviceContainer.registerClass(ErrorsExtractor, []);
serviceContainer.registerImplementation("WmsErrorsExtractor", ErrorsExtractor, {
  name: "1.3.0",
});

serviceContainer.registerFactory("WmsVersionAdapterResolver", (context) => {
  return new BaseWmsVersionAdapterResolver(
    context.resolveAll("WmsVersionAdapter")
  );
});
