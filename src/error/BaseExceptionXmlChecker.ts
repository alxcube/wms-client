import xpath from "xpath";
import type {
  ExceptionReportEntry,
  ExceptionReportExtractor,
} from "./ExceptionReportExtractor";
import type { ExceptionXmlChecker } from "./ExceptionXmlChecker";
import { WmsException } from "./WmsException";
import { WmsExceptionReport } from "./WmsExceptionReport";
import { XMLSerializer } from "@xmldom/xmldom";

/**
 * Base ExceptionXmlChecker class.
 */
export class BaseExceptionXmlChecker implements ExceptionXmlChecker {
  /**
   * BaseExceptionXmlChecker constructor.
   *
   * @param exceptionReportExtractors
   * @param xmlSerializer
   */
  constructor(
    private readonly exceptionReportExtractors: ExceptionReportExtractor[],
    private readonly xmlSerializer: XMLSerializer
  ) {}

  /**
   * @inheritdoc
   */
  check(responseDoc: Document) {
    if (!this.isException(responseDoc)) {
      return;
    }
    const exceptionReport = this.getExceptionReport(responseDoc);
    const wmsExceptions = exceptionReport.map(
      (entry) => new WmsException(entry.message, entry.code, entry.locator)
    );
    if (wmsExceptions.length === 1) {
      throw wmsExceptions[0];
    }
    throw new WmsExceptionReport(wmsExceptions);
  }

  /**
   * Checks if root node of document contains 'exception' in its name.
   *
   * @param xmlResponse
   * @private
   */
  private isException(xmlResponse: Document): boolean {
    const rootNode = xpath.select1("/*", xmlResponse) as Node;
    return /exception/i.test(rootNode.nodeName);
  }

  /**
   * Extracts array of ExceptionReportEntry objects from document.
   *
   * @param exceptionResponseDoc
   * @private
   */
  private getExceptionReport(
    exceptionResponseDoc: Document
  ): ExceptionReportEntry[] {
    for (const extractor of this.exceptionReportExtractors) {
      const report = extractor.extractExceptionReport(exceptionResponseDoc);
      if (report) {
        return report;
      }
    }

    const errorXml = this.xmlSerializer.serializeToString(exceptionResponseDoc);
    throw new WmsException(
      `Could not find matching ExceptionReportExtractor. Response XML:\n${errorXml}`
    );
  }
}
