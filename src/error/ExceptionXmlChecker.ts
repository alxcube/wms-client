export interface ExceptionXmlChecker {
  check(responseDoc: Document): void | never;
}
