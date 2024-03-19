import type { QueryParamsSerializer } from "./query-params-serializer/QueryParamsSerializer";
import type { ServicesMap } from "./service-container/ServiceResolver";
import type {
  WmsCapabilitiesRequestParamsTransformer,
  WmsCapabilitiesResponseDataExtractor,
  WmsErrorsExtractor,
  WmsMapRequestParamsTransformer,
} from "./version-adapter/BaseWmsVersionAdapter";
import type { WmsVersionAdapter } from "./version-adapter/WmsVersionAdapter";
import type { WmsVersionAdapterResolver } from "./version-adapter/WmsVersionAdapterResolver";
import type { WmsClientFactory } from "./WmsClientFactory";

export interface TypesMap extends ServicesMap {
  WmsClientFactory: WmsClientFactory;
  QueryParamsSerializer: QueryParamsSerializer;
  WmsVersionAdapter: WmsVersionAdapter;
  WmsCapabilitiesRequestParamsTransformer: WmsCapabilitiesRequestParamsTransformer;
  WmsCapabilitiesResponseDataExtractor: WmsCapabilitiesResponseDataExtractor;
  WmsMapRequestParamsTransformer: WmsMapRequestParamsTransformer;
  WmsErrorsExtractor: WmsErrorsExtractor;
  WmsVersionAdapterResolver: WmsVersionAdapterResolver;
}
