import { beforeEach, describe, expect, it } from "vitest";
import { ExceptionReportExtractor_1_0 } from "../../../src";
import { testContainer } from "../../testContainer";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_1 from "../../fixtures/exception_1_1_1.xml?raw";

describe("ExceptionReportExtractor_1_0 class", () => {
  const exceptionXml_1_0 = `
<WMTException version="1.0.0">
    Error message
</WMTException>`;

  let extractor: ExceptionReportExtractor_1_0;
  let xmlParser: DOMParser;
  let exceptionDoc_1_0: Document;
  let exceptionDoc_1_1: Document;

  beforeEach(() => {
    xmlParser = testContainer.resolve("DOMParser");
    extractor = testContainer.instantiate(ExceptionReportExtractor_1_0, []);
    exceptionDoc_1_0 = xmlParser.parseFromString(exceptionXml_1_0, "text/xml");
    exceptionDoc_1_1 = xmlParser.parseFromString(exceptionXml_1_1, "text/xml");
  });

  describe("extractExceptionReport() method", () => {
    it("should extract ExceptionReportEntry objects array with single exception from exception XML v1.0.0", () => {
      expect(extractor.extractExceptionReport(exceptionDoc_1_0)).toEqual([
        { message: "Error message" },
      ]);
    });

    it("should return undefined, when passed document with WMS exception v1.1", () => {
      expect(
        extractor.extractExceptionReport(exceptionDoc_1_1)
      ).toBeUndefined();
    });
  });
});
