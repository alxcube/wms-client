import type {
  SingleNodeDataExtractorFn,
  SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";

export type XmlDataExtractor<T> =
  | SingleNodeDataExtractorFnFactory<T>
  | SingleNodeDataExtractorFn<T>;
