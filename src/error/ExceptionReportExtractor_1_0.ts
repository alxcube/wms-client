import xpath, { select } from "xpath";
import type {
  ExceptionReportEntry,
  ExceptionReportExtractor,
} from "./ExceptionReportExtractor";

export class ExceptionReportExtractor_1_0 implements ExceptionReportExtractor {
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
