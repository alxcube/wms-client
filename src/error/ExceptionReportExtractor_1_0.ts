import xpath, { select } from "xpath";
import type {
  ExceptionReportEntry,
  ExceptionReportExtractor,
} from "./ExceptionReportExtractor";

/**
 * ExceptionReportExtractor for WMS v1.0
 */
export class ExceptionReportExtractor_1_0 implements ExceptionReportExtractor {
  /**
   * @inheritdoc
   */
  extractExceptionReport(doc: Document): ExceptionReportEntry[] | undefined {
    const exceptionNode = xpath.select(
      "/WMTException",
      doc,
      true
    ) as Node | null;
    if (exceptionNode) {
      const message = (select("string(.)", exceptionNode) as string).trim();
      return [{ message }];
    }
  }
}
