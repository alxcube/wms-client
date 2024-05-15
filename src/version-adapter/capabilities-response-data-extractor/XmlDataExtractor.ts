import type {
  SingleNodeDataExtractorFn,
  SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";

/**
 * Type alias data extractor function or data extractor function factory.
 */
export type XmlDataExtractor<T> =
  | SingleNodeDataExtractorFnFactory<T>
  | SingleNodeDataExtractorFn<T>;
