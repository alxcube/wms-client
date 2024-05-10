import type { WmsExceptionCode } from "./WmsExceptionCode";

/**
 * WMS exception entry interface.
 */
export interface ExceptionReportEntry {
  /**
   * Exception message.
   */
  message: string;

  /**
   * Exception code.
   */
  code?: WmsExceptionCode;

  /**
   * Request param that caused exception.
   */
  locator?: string;
}

/**
 * Exception report extractor.
 */
export interface ExceptionReportExtractor {
  extractExceptionReport(doc: Document): ExceptionReportEntry[] | undefined;
}
