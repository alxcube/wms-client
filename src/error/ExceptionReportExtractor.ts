import type { WmsExceptionCode } from "./WmsExceptionCode";

export interface ExceptionReportEntry {
  message: string;
  code?: WmsExceptionCode;
  locator?: string;
}

export interface ExceptionReportExtractor {
  extractExceptionReport(doc: Document): ExceptionReportEntry[] | undefined;
}
