import { BaseWmsClientFactory } from "./BaseWmsClientFactory";
import { BaseQueryParamsSerializer } from "./query-params-serializer/BaseQueryParamsSerializer";
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

serviceContainer.registerFactory(
  "WmsVersionAdapter",
  (context) => {
    const version = "1.3.0";
    return new BaseWmsVersionAdapter(
      version,
      context.resolve("WmsCapabilitiesRequestParamsTransformer", version),
      context.resolve("WmsCapabilitiesResponseDataExtractor", version),
      context.resolve("WmsMapRequestParamsTransformer", version),
      context.resolve("WmsErrorsExtractor", version)
    );
  },
  {
    name: "1.3.0",
  }
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
