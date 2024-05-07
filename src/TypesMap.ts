import type { RequestErrorHandler, WmsClientFactory } from "./client";
import type {
  ExceptionReportExtractor,
  ExceptionXmlChecker,
  ExceptionFormat,
} from "./error";
import type {
  CapabilitiesRequestParamsTransformer,
  CapabilitiesResponseDataExtractor,
  FeatureInfoRequestParamsTransformer,
  MapRequestParamsTransformer,
  UnifiedCapabilitiesResponse,
  VersionCompatibilityChecker,
  WmsVersionAdapter,
  WmsVersionAdapterResolver,
  XmlDataExtractor,
  Keyword,
  Layer,
  XmlResponseVersionExtractor,
} from "./version-adapter";
import type { QueryParamsSerializer } from "./query-params-serializer";
import type { ServicesMap } from "@alxcube/di-container";
import type { VersionComparator } from "./version-comparator";
import type { WmsNegotiator } from "./negotiator";
import type { WmsXmlParser } from "./wms-xml-parser";

export interface TypesMap extends ServicesMap {
  RequestErrorHandler: RequestErrorHandler;
  WmsClientFactory: WmsClientFactory;

  ExceptionXmlChecker: ExceptionXmlChecker;
  ExceptionReportExtractor: ExceptionReportExtractor;
  "ExceptionReportExtractor[]": ExceptionReportExtractor[];

  WmsNegotiator: WmsNegotiator;

  QueryParamsSerializer: QueryParamsSerializer;

  WmsVersionAdapter: WmsVersionAdapter;
  "WmsVersionAdapter[]": WmsVersionAdapter[];
  WmsVersionAdapterResolver: WmsVersionAdapterResolver;
  CapabilitiesRequestParamsTransformer: CapabilitiesRequestParamsTransformer;
  CapabilitiesResponseDataExtractor: CapabilitiesResponseDataExtractor;
  MapRequestParamsTransformer: MapRequestParamsTransformer;
  FeatureInfoRequestParamsTransformer: FeatureInfoRequestParamsTransformer;
  VersionCompatibilityChecker: VersionCompatibilityChecker;

  // XML data extractors
  "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>": XmlDataExtractor<
    UnifiedCapabilitiesResponse["service"]
  >;
  "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>": XmlDataExtractor<
    UnifiedCapabilitiesResponse["capability"]
  >;
  "XmlDataExtractor<Keyword[]>": XmlDataExtractor<Keyword[] | undefined>;
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
  "XmlDataExtractor<Layer[styles][styleUrl]>": XmlDataExtractor<
    NonNullable<Layer["styles"]>[number]["styleUrl"]
  >;

  VersionComparator: VersionComparator;

  WmsXmlParser: WmsXmlParser;

  XmlResponseVersionExtractor: XmlResponseVersionExtractor;

  // Other interfaces
  DOMParser: DOMParser;
  XMLSerializer: XMLSerializer;
  TextDecoder: TextDecoder;
}
