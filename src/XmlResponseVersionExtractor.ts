export interface XmlResponseVersionExtractor {
  extractVersion(doc: Document): string;
}
