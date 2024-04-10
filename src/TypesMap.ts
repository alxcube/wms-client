import type { ExceptionReportExtractor } from "./error/ExceptionReportExtractor";
import type { ExceptionXmlChecker } from "./error/ExceptionXmlChecker";
import type { ExceptionFormat } from "./ExceptionFormat";
import type { QueryParamsSerializer } from "./query-params-serializer/QueryParamsSerializer";
import type { ServicesMap } from "./service-container/ServiceResolver";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";
import type {
  WmsCapabilitiesRequestParamsTransformer,
  WmsCapabilitiesResponseDataExtractor,
  WmsMapRequestParamsTransformer,
} from "./version-adapter/BaseWmsVersionAdapter";
import type { VersionCompatibilityChecker } from "./version-adapter/version-compatibility-checker/VersionCompatibilityChecker";
import type { WmsVersionAdapter } from "./version-adapter/WmsVersionAdapter";
import type { WmsVersionAdapterResolver } from "./version-adapter/version-adapter-resolver/WmsVersionAdapterResolver";
import type { XmlDataExtractor } from "./version-adapter/capabilities-response-data-extractor/XmlDataExtractor";
import type { VersionComparator } from "./version-comparator/VersionComparator";
import type { Keyword } from "./wms-data-types/Keyword";
import type { Layer } from "./wms-data-types/Layer";
import type { WmsClientFactory } from "./WmsClientFactory";
import type { WmsNegotiator } from "./WmsNegotiator";
import type { XmlResponseVersionExtractor } from "./XmlResponseVersionExtractor";

export interface TypesMap extends ServicesMap {
  WmsClientFactory: WmsClientFactory;
  QueryParamsSerializer: QueryParamsSerializer;
  WmsVersionAdapter: WmsVersionAdapter;
  "WmsVersionAdapter[]": WmsVersionAdapter[];
  WmsCapabilitiesRequestParamsTransformer: WmsCapabilitiesRequestParamsTransformer;
  WmsCapabilitiesResponseDataExtractor: WmsCapabilitiesResponseDataExtractor;
  WmsMapRequestParamsTransformer: WmsMapRequestParamsTransformer;
  WmsVersionAdapterResolver: WmsVersionAdapterResolver;

  //
  "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>": XmlDataExtractor<
    UnifiedCapabilitiesResponse["service"]
  >;
  "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>": XmlDataExtractor<
    UnifiedCapabilitiesResponse["capability"]
  >;

  //
  "XmlDataExtractor<Keyword[]>": XmlDataExtractor<Keyword[] | undefined>;

  //
  "XmlDataExtractor<Layer[]>": XmlDataExtractor<Layer[]>;

  "XmlDataExtractor<Layer[crs]>": XmlDataExtractor<Layer["crs"]>;
  "XmlDataExtractor<Layer[dimensions]>": XmlDataExtractor<Layer["dimensions"]>;
  "XmlDataExtractor<Layer[geographicBounds]>": XmlDataExtractor<
    Layer["geographicBounds"]
  >;
  "XmlDataExtractor<Layer[boundingBoxes]>": XmlDataExtractor<
    Layer["boundingBoxes"]
  >;
  "XmlDataExtractor<Layer[attribution]>": XmlDataExtractor<
    Layer["attribution"]
  >;
  "XmlDataExtractor<Layer[authorityUrls]>": XmlDataExtractor<
    Layer["authorityUrls"]
  >;
  "XmlDataExtractor<Layer[identifiers]>": XmlDataExtractor<
    Layer["identifiers"]
  >;
  "XmlDataExtractor<Layer[metadataUrls]>": XmlDataExtractor<
    Layer["metadataUrls"]
  >;
  "XmlDataExtractor<Layer[dataUrls]>": XmlDataExtractor<Layer["dataUrls"]>;
  "XmlDataExtractor<Layer[featureListUrls]>": XmlDataExtractor<
    Layer["featureListUrls"]
  >;
  "XmlDataExtractor<Layer[styles]>": XmlDataExtractor<Layer["styles"]>;
  "XmlDataExtractor<ExceptionFormat[]>": XmlDataExtractor<ExceptionFormat[]>;

  VersionComparator: VersionComparator;
  ExceptionXmlChecker: ExceptionXmlChecker;
  ExceptionReportExtractor: ExceptionReportExtractor;
  "ExceptionReportExtractor[]": ExceptionReportExtractor[];
  XmlResponseVersionExtractor: XmlResponseVersionExtractor;
  WmsNegotiator: WmsNegotiator;
  DOMParser: DOMParser;
  XMLSerializer: XMLSerializer;
  VersionCompatibilityChecker: VersionCompatibilityChecker;
}
