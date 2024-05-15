/**
 * WMS XML parser with checking for WMS exception response.
 */
export interface WmsXmlParser {
  /**
   * Parses XML and returns parsed document. When given XML is WMS exception report, throws either `WmsException`, if
   * there is single exception entry, or `WmsExceptionReport`, when there are multiple exception entries.
   *
   * @param xml
   */
  parse(xml: string): Document;
}
