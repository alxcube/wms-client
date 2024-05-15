/**
 * Interface for extractor of WMS version from XML response document.
 */
export interface XmlResponseVersionExtractor {
  /**
   * Extractor WMS version from WMS XML response document.
   *
   * @param doc
   */
  extractVersion(doc: Document): string;
}
