import { constant } from "@alxcube/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import { GenericExceptionReportExtractor } from "../../../src";
import { testContainer } from "../../testContainer";

// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_1_0 from "../../fixtures/exception_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_1_1 from "../../fixtures/exception_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_3_0 from "../../fixtures/exceptions_1_3_0.xml?raw";

describe("GenericExceptionReportExtractor class", () => {
  let xmlParser: DOMParser;
  let exceptionDoc_1_1_0: Document;
  let exceptionDoc_1_1_1: Document;
  let exceptionDoc_1_3_0: Document;
  let extractor_1_1_1: GenericExceptionReportExtractor;
  let extractor_1_3_0: GenericExceptionReportExtractor;

  beforeEach(() => {
    extractor_1_1_1 = testContainer.instantiate(
      GenericExceptionReportExtractor,
      [
        "XmlResponseVersionExtractor",
        "VersionComparator",
        constant("1.1"),
        constant("1.2"),
        constant(""),
      ]
    );
    extractor_1_3_0 = testContainer.instantiate(
      GenericExceptionReportExtractor,
      [
        "XmlResponseVersionExtractor",
        "VersionComparator",
        constant("1.3"),
        constant("1.4"),
        constant("ogc"),
      ]
    );

    xmlParser = testContainer.resolve("DOMParser");

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
  });

  describe("extractExceptionReport() method", () => {
    it("should extract ExceptionReportEntry array from exception xml v1.1.0", () => {
      const entries =
        extractor_1_1_1.extractExceptionReport(exceptionDoc_1_1_0);
      expect(entries).toBeDefined();
      expect(entries?.length).toBe(4);
      expect(entries).toEqual([
        {
          message: "Plain text message about an error.",
        },
        {
          message: "Another message, this time with a SE code supplied.",
          code: "InvalidUpdateSequence",
        },
        {
          message:
            "Error in module <foo.c>, line 42\n" +
            "\n" +
            "    A message that includes angle brackets in text\n" +
            "    must be enclosed in a Character Data Section\n" +
            "    as in this example.  All XML-like markup is\n" +
            "    ignored except for this sequence of three\n" +
            "    closing characters:",
        },
        {
          message:
            "<Module>foo.c</Module>\n" +
            "      <Error>An error occurred</Error>\n" +
            "      <Explanation>Similarly, actual XML\n" +
            "\tcan be enclosed in a CDATA section.\n" +
            "\tA generic parser will ignore that XML,\n" +
            "\tbut application-specific software may choose\n" +
            "\tto process it.</Explanation>",
        },
      ]);
    });

    it("should extract ExceptionReportEntry array from exception xml v1.1.1", () => {
      const entries =
        extractor_1_1_1.extractExceptionReport(exceptionDoc_1_1_1);
      expect(entries).toBeDefined();
      expect(entries?.length).toBe(4);
      expect(entries).toEqual([
        {
          message: "Plain text message about an error.",
        },
        {
          message:
            "Another message, this one with a Service Exception code supplied.",
          code: "InvalidUpdateSequence",
        },
        {
          message:
            "Error in module <foo.c>, line 42\n" +
            "\n" +
            "    A message that includes angle brackets in text\n" +
            "    must be enclosed in a Character Data Section\n" +
            "    as in this example.  All XML-like markup is\n" +
            "    ignored except for this sequence of three\n" +
            "    closing characters:",
        },
        {
          message:
            "<Module>foo.c</Module>\n" +
            "      <Error>An error occurred</Error>\n" +
            "      <Explanation>Similarly, actual XML\n" +
            "\tcan be enclosed in a CDATA section.\n" +
            "\tA generic parser will ignore that XML,\n" +
            "\tbut application-specific software may choose\n" +
            "\tto process it.</Explanation>",
        },
      ]);
    });

    it("should extract ExceptionReportEntry array from exception xml v1.3.0", () => {
      const entries =
        extractor_1_3_0.extractExceptionReport(exceptionDoc_1_3_0);
      expect(entries).toBeDefined();
      expect(entries?.length).toBe(4);
      expect(entries).toEqual([
        {
          message: "Plain text message about an error.",
        },
        {
          message:
            "Another error message, this one with a service exception code supplied.",
          code: "InvalidUpdateSequence",
        },
        {
          message:
            "Error in module <foo.c>, line 42\n" +
            "\n" +
            "A message that includes angle brackets in text\n" +
            "must be enclosed in a Character Data Section\n" +
            "as in this example.  All XML-like markup is\n" +
            "ignored except for this sequence of three\n" +
            "closing characters:",
        },
        {
          message:
            "<Module>foo.c</Module>\n" +
            "<Error>An error occurred</Error>\n" +
            "<Explanation>Similarly, actual XML\n" +
            "can be enclosed in a CDATA section.\n" +
            "A generic parser will ignore that XML,\n" +
            "but application-specific software may choose\n" +
            "to process it.</Explanation>",
        },
      ]);
    });

    it("should return undefined, when given unsupported version of exception xml", () => {
      expect(
        extractor_1_1_1.extractExceptionReport(exceptionDoc_1_3_0)
      ).toBeUndefined();
      expect(
        extractor_1_3_0.extractExceptionReport(exceptionDoc_1_1_0)
      ).toBeUndefined();
      expect(
        extractor_1_3_0.extractExceptionReport(exceptionDoc_1_1_1)
      ).toBeUndefined();
    });
  });
});
