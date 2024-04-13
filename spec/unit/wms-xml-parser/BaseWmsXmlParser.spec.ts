import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isDocumentNode } from "xpath";
import { WmsException } from "../../../src/error/WmsException";
import { WmsExceptionReport } from "../../../src/error/WmsExceptionReport";
import { BaseWmsXmlParser } from "../../../src/wms-xml-parser/BaseWmsXmlParser";
import { testContainer } from "../../testContainer";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_1_0 from "../../fixtures/capabilities_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionsXml_1_1_0 from "../../fixtures/exception_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionsXml_1_1_1 from "../../fixtures/exception_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionsXml_1_3_0 from "../../fixtures/exceptions_1_3_0.xml?raw";

describe("BaseWmsXmlParser class", () => {
  let parser: BaseWmsXmlParser;

  beforeEach(() => {
    testContainer.backup();
    testContainer.registerClass(BaseWmsXmlParser, [
      "DOMParser",
      "ExceptionXmlChecker",
    ]);
    parser = testContainer.resolve(BaseWmsXmlParser);
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("parse() method", () => {
    it("should parse xml string and return Document", () => {
      const doc = parser.parse(capabilitiesXml_1_1_0);
      expect(isDocumentNode(doc)).toBe(true);
    });

    it("should throw WmsExceptionReport, when there is exception report with multiple errors in xml", () => {
      expect(() => parser.parse(exceptionsXml_1_1_0)).toThrow(
        WmsExceptionReport
      );
      expect(() => parser.parse(exceptionsXml_1_1_1)).toThrow(
        WmsExceptionReport
      );
      expect(() => parser.parse(exceptionsXml_1_3_0)).toThrow(
        WmsExceptionReport
      );
    });

    it("should throw WmsException, when there is exception report with single error in xml", () => {
      const xml = `<ServiceExceptionReport version="1.1.0"><ServiceException>Message</ServiceException></ServiceExceptionReport>`;
      expect(() => parser.parse(xml)).toThrow(WmsException);
    });

    it("should throw WmsException, when root node name contains 'exception' text, but that is not known wms exception", () => {
      const xml = "<SomeExceptionEvent>Message</SomeExceptionEvent>";
      expect(() => parser.parse(xml)).toThrow(WmsException);
    });
  });
});
