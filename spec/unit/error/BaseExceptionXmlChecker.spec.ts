import { beforeEach, describe, expect, it } from "vitest";
import {
  BaseExceptionXmlChecker,
  WmsException,
  WmsExceptionCode,
  WmsExceptionReport,
} from "../../../src";
import { testContainer } from "../../testContainer";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_1_0 from "../../fixtures/exception_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_1_1 from "../../fixtures/exception_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_3_0 from "../../fixtures/exceptions_1_3_0.xml?raw";

describe("BaseExceptionXmlChecker class", () => {
  const singleExceptionReportXml_1_1_1 = `
<ServiceExceptionReport version="1.1.1">
  <ServiceException code="InvalidSRS">
    Single exception message v1.1.1
  </ServiceException>
</ServiceExceptionReport>`;

  const singleExceptionReportXml_1_3_0 = `
<ServiceExceptionReport version="1.3.0"
  xmlns="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/ogc">
  <ServiceException code="InvalidCRS">
    Single exception message v1.3.0
  </ServiceException>
</ServiceExceptionReport>`;

  let checker: BaseExceptionXmlChecker;
  let xmlParser: DOMParser;
  let exceptionDoc_1_1_0: Document;
  let exceptionDoc_1_1_1: Document;
  let exceptionDoc_1_3_0: Document;
  let singleExceptionDoc_1_1_1: Document;
  let singleExceptionDoc_1_3_0: Document;

  beforeEach(() => {
    xmlParser = testContainer.resolve("DOMParser");
    checker = testContainer.instantiate(BaseExceptionXmlChecker, [
      "ExceptionReportExtractor[]",
      "XMLSerializer",
    ]);

    exceptionDoc_1_1_0 = xmlParser.parseFromString(
      exceptionXml_1_1_0,
      "text/xml"
    );
    exceptionDoc_1_1_1 = xmlParser.parseFromString(
      exceptionXml_1_1_1,
      "text/xml"
    );
    exceptionDoc_1_3_0 = xmlParser.parseFromString(
      exceptionXml_1_3_0,
      "text/xml"
    );
    singleExceptionDoc_1_1_1 = xmlParser.parseFromString(
      singleExceptionReportXml_1_1_1,
      "text/xml"
    );
    singleExceptionDoc_1_3_0 = xmlParser.parseFromString(
      singleExceptionReportXml_1_3_0,
      "text/xml"
    );
  });

  describe("check() method", () => {
    it("should throw WmsExceptionReport, when given document with WMS exception report v1.1.0", () => {
      try {
        checker.check(exceptionDoc_1_1_0);
        expect.fail("Should throw WmsExceptionReport");
      } catch (e) {
        expect(e).toBeInstanceOf(WmsExceptionReport);
        expect((e as WmsExceptionReport).exceptions.length).toBe(4);
        expect((e as WmsExceptionReport).exceptions[0].message).toMatch(
          "Plain text message about an error."
        );
        expect((e as WmsExceptionReport).exceptions[1].message).toMatch(
          "Another message, this time with a SE code supplied."
        );
        expect((e as WmsExceptionReport).exceptions[1].code).toBe(
          WmsExceptionCode.InvalidUpdateSequence
        );
        expect((e as WmsExceptionReport).exceptions[2].message).toMatch(
          "Error in module <foo.c>, line 42\n" +
            "\n" +
            "    A message that includes angle brackets in text\n" +
            "    must be enclosed in a Character Data Section\n" +
            "    as in this example.  All XML-like markup is\n" +
            "    ignored except for this sequence of three\n" +
            "    closing characters:"
        );
        expect((e as WmsExceptionReport).exceptions[3].message).toMatch(
          "<Module>foo.c</Module>\n" +
            "      <Error>An error occurred</Error>\n" +
            "      <Explanation>Similarly, actual XML\n" +
            "\tcan be enclosed in a CDATA section.\n" +
            "\tA generic parser will ignore that XML,\n" +
            "\tbut application-specific software may choose\n" +
            "\tto process it.</Explanation>"
        );
      }
    });

    it("should throw WmsExceptionReport, when given document with WMS exception report v1.1.1", () => {
      try {
        checker.check(exceptionDoc_1_1_1);
        expect.fail("Should throw WmsExceptionReport");
      } catch (e) {
        expect(e).toBeInstanceOf(WmsExceptionReport);
        expect((e as WmsExceptionReport).exceptions.length).toBe(4);
        expect((e as WmsExceptionReport).exceptions[0].message).toMatch(
          "Plain text message about an error."
        );
        expect((e as WmsExceptionReport).exceptions[1].message).toMatch(
          "Another message, this one with a Service Exception code supplied."
        );
        expect((e as WmsExceptionReport).exceptions[1].code).toBe(
          WmsExceptionCode.InvalidUpdateSequence
        );
        expect((e as WmsExceptionReport).exceptions[2].message).toMatch(
          "Error in module <foo.c>, line 42\n" +
            "\n" +
            "    A message that includes angle brackets in text\n" +
            "    must be enclosed in a Character Data Section\n" +
            "    as in this example.  All XML-like markup is\n" +
            "    ignored except for this sequence of three\n" +
            "    closing characters:"
        );
        expect((e as WmsExceptionReport).exceptions[3].message).toMatch(
          "<Module>foo.c</Module>\n" +
            "      <Error>An error occurred</Error>\n" +
            "      <Explanation>Similarly, actual XML\n" +
            "\tcan be enclosed in a CDATA section.\n" +
            "\tA generic parser will ignore that XML,\n" +
            "\tbut application-specific software may choose\n" +
            "\tto process it.</Explanation>"
        );
      }
    });

    it("should throw WmsExceptionReport, when given document with WMS exception report v1.3.0", () => {
      try {
        checker.check(exceptionDoc_1_3_0);
        expect.fail("Should throw WmsExceptionReport");
      } catch (e) {
        expect(e).toBeInstanceOf(WmsExceptionReport);
        expect((e as WmsExceptionReport).exceptions.length).toBe(4);
        expect((e as WmsExceptionReport).exceptions[0].message).toMatch(
          "Plain text message about an error."
        );
        expect((e as WmsExceptionReport).exceptions[1].message).toMatch(
          "Another error message, this one with a service exception code supplied."
        );
        expect((e as WmsExceptionReport).exceptions[1].code).toBe(
          WmsExceptionCode.InvalidUpdateSequence
        );
        expect((e as WmsExceptionReport).exceptions[2].message).toMatch(
          "Error in module <foo.c>, line 42\n" +
            "\n" +
            "A message that includes angle brackets in text\n" +
            "must be enclosed in a Character Data Section\n" +
            "as in this example.  All XML-like markup is\n" +
            "ignored except for this sequence of three\n" +
            "closing characters:"
        );
        expect((e as WmsExceptionReport).exceptions[3].message).toMatch(
          "<Module>foo.c</Module>\n" +
            "<Error>An error occurred</Error>\n" +
            "<Explanation>Similarly, actual XML\n" +
            "can be enclosed in a CDATA section.\n" +
            "A generic parser will ignore that XML,\n" +
            "but application-specific software may choose\n" +
            "to process it.</Explanation>"
        );
      }
    });

    it("should throw WmsException, when only one exception is in xml report v1.1.1", () => {
      try {
        checker.check(singleExceptionDoc_1_1_1);
        expect.fail("Should throw WmsException");
      } catch (e) {
        expect(e).toBeInstanceOf(WmsException);
        expect((e as WmsException).message).toMatch(
          "Single exception message v1.1.1"
        );
        expect((e as WmsException).code).toBe(WmsExceptionCode.InvalidCRS);
      }
    });

    it("should throw WmsException, when only one exception is in xml report v1.3.0", () => {
      try {
        checker.check(singleExceptionDoc_1_3_0);
        expect.fail("Should throw WmsException");
      } catch (e) {
        expect(e).toBeInstanceOf(WmsException);
        expect((e as WmsException).message).toMatch(
          "Single exception message v1.3.0"
        );
        expect((e as WmsException).code).toBe(WmsExceptionCode.InvalidCRS);
      }
    });

    it("should throw WmsException with all XML as message, when root node has 'exception' in its name, but no dedicated data extractor is registered", () => {
      const xml = "<ExceptionMessage>Unknown error</ExceptionMessage>";
      const doc = xmlParser.parseFromString(xml, "text/xml");
      try {
        checker.check(doc);
        expect.fail("Should throw WmsException");
      } catch (e) {
        expect(e).toBeInstanceOf(WmsException);
        expect((e as WmsException).message).toMatch(xml);
      }
    });

    it("should return void, when xml doesn't contains exception", () => {
      const xml = `<Test>No exception</Test>`;
      const doc = xmlParser.parseFromString(xml, "text/xml");
      expect(() => checker.check(doc)).not.toThrow();
    });
  });
});
