/**
 * Exception XML checker.
 */
export interface ExceptionXmlChecker {
  /**
   * Checks if given document contains WMS exception info. Throws `WmsExceptionReport` if multiple exception entries
   * found in given document. Throws `WmsException`, if single exception entry is found in given document. Returns
   * void, when given document is not WMS exception XML.
   *
   * @param responseDoc
   */
  check(responseDoc: Document): void | never;
}
