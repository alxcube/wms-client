import xpath from "xpath";
import type {
  ExceptionReportEntry,
  ExceptionReportExtractor,
} from "./ExceptionReportExtractor";
import type { ExceptionXmlChecker } from "./ExceptionXmlChecker";
import { WmsException } from "./WmsException";
import { WmsExceptionReport } from "./WmsExceptionReport";
import { XMLSerializer } from "@xmldom/xmldom";

export class BaseExceptionXmlChecker implements ExceptionXmlChecker {
  constructor(
    private readonly exceptionReportExtractors: ExceptionReportExtractor[]
  ) {}
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

  private isException(xmlResponse: Document): boolean {
    const rootNode = xpath.select1("/*", xmlResponse) as Node;
    return /exception/i.test(rootNode.nodeName);
  }

  private getExceptionReport(
    exceptionResponseDoc: Document
  ): ExceptionReportEntry[] {
    for (const extractor of this.exceptionReportExtractors) {
      const report = extractor.extractExceptionReport(exceptionResponseDoc);
      if (report) {
        return report;
      }
    }
    // Todo: make dependency
    const xmlSerializer = new XMLSerializer();
    const errorXml = xmlSerializer.serializeToString(exceptionResponseDoc);
    throw new WmsException(
      `Could not find matching ExceptionReportExtractor. Response XML:\n${errorXml}`
    );
  }
}
