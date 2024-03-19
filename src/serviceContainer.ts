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

serviceContainer.registerFactory(
  "WmsClientFactory",
  (context) =>
    new BaseWmsClientFactory(
      context.resolve("WmsVersionAdapterResolver"),
      context.resolve("QueryParamsSerializer")
    )
);

serviceContainer.registerFactory(
  "QueryParamsSerializer",
  () => new BaseQueryParamsSerializer()
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

serviceContainer.registerFactory(
  "WmsCapabilitiesResponseDataExtractor",
  () => {
    return new CapabilitiesResponseDataExtractor();
  },
  { name: "1.3.0" }
);

serviceContainer.registerFactory(
  "WmsMapRequestParamsTransformer",
  () => {
    return new MapRequestParamsTransformer();
  },
  { name: "1.3.0" }
);

serviceContainer.registerFactory(
  "WmsErrorsExtractor",
  () => {
    return new ErrorsExtractor();
  },
  { name: "1.3.0" }
);

serviceContainer.registerFactory("WmsVersionAdapterResolver", (context) => {
  return new BaseWmsVersionAdapterResolver(
    context.resolveAll("WmsVersionAdapter")
  );
});
