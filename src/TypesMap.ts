import type { RequestErrorHandler } from "./client/RequestErrorHandler";
import type { ExceptionReportExtractor } from "./error/ExceptionReportExtractor";
import type { ExceptionXmlChecker } from "./error/ExceptionXmlChecker";
import type { CapabilitiesRequestParamsTransformer } from "./version-adapter/capabilities-request-params-transformer/CapabilitiesRequestParamsTransformer";
import type { CapabilitiesResponseDataExtractor } from "./version-adapter/capabilities-response-data-extractor/CapabilitiesResponseDataExtractor";
import type { FeatureInfoRequestParamsTransformer } from "./version-adapter/feature-info-request-params-transformer/FeatureInfoRequestParamsTransformer";
import type { MapRequestParamsTransformer } from "./version-adapter/map-request-params-transformer/MapRequestParamsTransformer";
import type { ExceptionFormat } from "./wms-data-types/ExceptionFormat";
import type { QueryParamsSerializer } from "./query-params-serializer/QueryParamsSerializer";
import type { ServicesMap } from "./service-container/ServiceResolver";
import type { UnifiedCapabilitiesResponse } from "./wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";
import type { VersionCompatibilityChecker } from "./version-adapter/version-compatibility-checker/VersionCompatibilityChecker";
import type { WmsVersionAdapter } from "./version-adapter/WmsVersionAdapter";
import type { WmsVersionAdapterResolver } from "./version-adapter/version-adapter-resolver/WmsVersionAdapterResolver";
import type { XmlDataExtractor } from "./version-adapter/capabilities-response-data-extractor/XmlDataExtractor";
import type { VersionComparator } from "./version-comparator/VersionComparator";
import type { Keyword } from "./wms-data-types/get-capabilities-response/Keyword";
import type { Layer } from "./wms-data-types/get-capabilities-response/Layer";
import type { WmsClientFactory } from "./client/WmsClientFactory";
import type { WmsNegotiator } from "./negotiator/WmsNegotiator";
import type { WmsXmlParser } from "./wms-xml-parser/WmsXmlParser";
import type { XmlResponseVersionExtractor } from "./xml-response-version-extractor/XmlResponseVersionExtractor";

export interface TypesMap extends ServicesMap {
  WmsClientFactory: WmsClientFactory;
  QueryParamsSerializer: QueryParamsSerializer;
  WmsVersionAdapter: WmsVersionAdapter;
  "WmsVersionAdapter[]": WmsVersionAdapter[];
  CapabilitiesRequestParamsTransformer: CapabilitiesRequestParamsTransformer;
  CapabilitiesResponseDataExtractor: CapabilitiesResponseDataExtractor;
  MapRequestParamsTransformer: MapRequestParamsTransformer;
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
  WmsXmlParser: WmsXmlParser;
  TextDecoder: TextDecoder;
  RequestErrorHandler: RequestErrorHandler;
  FeatureInfoRequestParamsTransformer: FeatureInfoRequestParamsTransformer;
}
