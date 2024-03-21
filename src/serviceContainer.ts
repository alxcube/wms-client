import { BaseWmsClientFactory } from "./BaseWmsClientFactory";
import { BaseQueryParamsSerializer } from "./query-params-serializer/BaseQueryParamsSerializer";
import { Container } from "./service-container/Container";
import type { TypesMap } from "./TypesMap";
import { BaseWmsVersionAdapterResolver } from "./version-adapter/BaseWmsVersionAdapterResolver";
import { versionAdapterContainerModule_1_3_0 } from "./version-adapter/versionAdapterContainerModule_1_3_0";

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

serviceContainer.registerFactory("WmsVersionAdapterResolver", (context) => {
  return new BaseWmsVersionAdapterResolver(
    context.resolveAll("WmsVersionAdapter")
  );
});

serviceContainer.registerModule(versionAdapterContainerModule_1_3_0);
