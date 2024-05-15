import type { XmlDataExtractor } from "./XmlDataExtractor";

/**
 * Dummy data extractor, which always returns undefined. Used with WMS XML versions, that do not contain some
 * parts of `UnifiedCapabilitiesResponse` data, available in other versions.
 */
export const undefinedExtractor: XmlDataExtractor<undefined> = () => undefined;
