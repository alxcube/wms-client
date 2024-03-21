import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { capabilitiesRequestParamsTransformer } from "./1.3.0/capabilitiesRequestParamsTransformer";
import { CapabilitiesResponseDataExtractor } from "./1.3.0/CapabilitiesResponseDataExtractor";
import { ErrorsExtractor } from "./1.3.0/ErrorsExtractor";
import { MapRequestParamsTransformer } from "./1.3.0/MapRequestParamsTransformer";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";

export const versionAdapterContainerModule_1_3_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    container.registerClass(
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
    container.registerImplementation(
      "WmsVersionAdapter",
      { service: BaseWmsVersionAdapter, name: "1.3.0" },
      { name: "1.3.0" }
    );

    container.registerConstant(
      "WmsCapabilitiesRequestParamsTransformer",
      capabilitiesRequestParamsTransformer,
      { name: "1.3.0" }
    );

    container.registerClass(CapabilitiesResponseDataExtractor, []);
    container.registerImplementation(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
      { name: "1.3.0" }
    );

    container.registerClass(MapRequestParamsTransformer, []);
    container.registerImplementation(
      "WmsMapRequestParamsTransformer",
      MapRequestParamsTransformer,
      { name: "1.3.0" }
    );

    container.registerClass(ErrorsExtractor, []);
    container.registerImplementation("WmsErrorsExtractor", ErrorsExtractor, {
      name: "1.3.0",
    });
  },
};
