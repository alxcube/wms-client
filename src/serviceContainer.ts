import { BaseWmsClientFactory } from "./BaseWmsClientFactory";
import { BaseQueryParamsSerializer } from "./query-params-serializer/BaseQueryParamsSerializer";
import { Container } from "./service-container/Container";
import type { TypesMap } from "./TypesMap";
import { BaseWmsVersionAdapterResolver } from "./version-adapter/BaseWmsVersionAdapterResolver";
import { versionAdapterContainerModule_1_1_1 } from "./version-adapter/versionAdapterContainerModule_1_1_1";
import { versionAdapterContainerModule_1_3_0 } from "./version-adapter/versionAdapterContainerModule_1_3_0";
import { BaseVersionComparator } from "./version-comparator/BaseVersionComparator";

export const serviceContainer = new Container<TypesMap>();

serviceContainer.implement("WmsClientFactory", BaseWmsClientFactory, [
  "WmsVersionAdapterResolver",
  "QueryParamsSerializer",
]);

serviceContainer.implement(
  "QueryParamsSerializer",
  BaseQueryParamsSerializer,
  []
);

serviceContainer.implement("VersionComparator", BaseVersionComparator, []);

serviceContainer.registerFactory("WmsVersionAdapterResolver", (context) => {
  return new BaseWmsVersionAdapterResolver(
    context.resolveAll("WmsVersionAdapter")
  );
});

serviceContainer.registerModule(versionAdapterContainerModule_1_1_1);
serviceContainer.registerModule(versionAdapterContainerModule_1_3_0);
