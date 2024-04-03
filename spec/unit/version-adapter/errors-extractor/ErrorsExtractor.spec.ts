import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { constant } from "../../../../src/service-container/constant";
import { ErrorsExtractor } from "../../../../src/version-adapter/errors-extractor/ErrorsExtractor";
import { testContainer } from "../../../testContainer";
// eslint-disable-next-line import/no-unresolved
import exceptions_1_3_0 from "../../../fixtures/exceptions_1_3_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptions_1_1_0 from "../../../fixtures/exception_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptions_1_1_1 from "../../../fixtures/exception_1_1_1.xml?raw";
import { DOMParser } from "@xmldom/xmldom";

describe("ErrorsExtractor class", () => {
  let xmlParser: DOMParser;
  let errorsDoc_1_1_0: Document;
  let errorsDoc_1_1_1: Document;
  let errorsDoc_1_3_0: Document;
  let extractor_1_1_1: ErrorsExtractor;
  let extractor_1_3_0: ErrorsExtractor;

  beforeEach(() => {
    testContainer.backup();
    testContainer.registerClass(ErrorsExtractor, [constant("ogc")]);
    testContainer.registerClass(ErrorsExtractor, [constant("")], {
      name: "1.1.1",
    });
    xmlParser = new DOMParser();
    errorsDoc_1_1_0 = xmlParser.parseFromString(exceptions_1_1_0, "text/xml");
    errorsDoc_1_1_1 = xmlParser.parseFromString(exceptions_1_1_1, "text/xml");
    errorsDoc_1_3_0 = xmlParser.parseFromString(exceptions_1_3_0, "text/xml");
    extractor_1_1_1 = testContainer.resolve(ErrorsExtractor, "1.1.1");
    extractor_1_3_0 = testContainer.resolve(ErrorsExtractor);
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("extract() method", () => {
    it("should extract WmsError objects array from error xml response v1.3.0", () => {
      const errors = extractor_1_3_0.extract(errorsDoc_1_3_0);
      expect(errors.length).toBe(4);
      expect(errors[0].message).toMatch("Plain text message about an error.");
      expect(errors[1].message).toMatch(
        "Another error message, this one with a service exception code supplied."
      );
      expect(errors[1].code).toBe("InvalidUpdateSequence");
      expect(errors[2].message).toMatch(
        "Error in module <foo.c>, line 42\n" +
          "\n" +
          "A message that includes angle brackets in text\n" +
          "must be enclosed in a Character Data Section\n" +
          "as in this example.  All XML-like markup is\n" +
          "ignored except for this sequence of three\n" +
          "closing characters:"
      );
      expect(errors[3].message).toMatch(
        "<Module>foo.c</Module>\n" +
          "<Error>An error occurred</Error>\n" +
          "<Explanation>Similarly, actual XML\n" +
          "can be enclosed in a CDATA section.\n" +
          "A generic parser will ignore that XML,\n" +
          "but application-specific software may choose\n" +
          "to process it.</Explanation>"
      );
    });

    it("should extract WmsError objects array from error xml response v1.1.1", () => {
      const errors = extractor_1_1_1.extract(errorsDoc_1_1_1);
      expect(errors.length).toBe(4);
      expect(errors[0].message).toMatch("Plain text message about an error.");
      expect(errors[1].message).toMatch(
        "Another message, this one with a Service Exception code supplied."
      );
      expect(errors[1].code).toBe("InvalidUpdateSequence");
      expect(errors[2].message).toMatch(
        "Error in module <foo.c>, line 42\n" +
          "\n" +
          "    A message that includes angle brackets in text\n" +
          "    must be enclosed in a Character Data Section\n" +
          "    as in this example.  All XML-like markup is\n" +
          "    ignored except for this sequence of three\n" +
          "    closing characters:"
      );
      expect(errors[3].message).toMatch(
        "<Module>foo.c</Module>\n" +
          "      <Error>An error occurred</Error>\n" +
          "      <Explanation>Similarly, actual XML\n" +
          "\tcan be enclosed in a CDATA section.\n" +
          "\tA generic parser will ignore that XML,\n" +
          "\tbut application-specific software may choose\n" +
          "\tto process it.</Explanation>"
      );
    });

    it("should extract WmsError objects array from error xml response v1.1.0", () => {
      const errors = extractor_1_1_1.extract(errorsDoc_1_1_0);
      expect(errors.length).toBe(4);
      expect(errors[0].message).toMatch("Plain text message about an error.");
      expect(errors[1].message).toMatch(
        "Another message, this time with a SE code supplied."
      );
      expect(errors[1].code).toBe("InvalidUpdateSequence");
      expect(errors[2].message).toMatch(
        "Error in module <foo.c>, line 42\n" +
          "\n" +
          "    A message that includes angle brackets in text\n" +
          "    must be enclosed in a Character Data Section\n" +
          "    as in this example.  All XML-like markup is\n" +
          "    ignored except for this sequence of three\n" +
          "    closing characters:"
      );
      expect(errors[3].message).toMatch(
        "<Module>foo.c</Module>\n" +
          "      <Error>An error occurred</Error>\n" +
          "      <Explanation>Similarly, actual XML\n" +
          "\tcan be enclosed in a CDATA section.\n" +
          "\tA generic parser will ignore that XML,\n" +
          "\tbut application-specific software may choose\n" +
          "\tto process it.</Explanation>"
      );
    });
  });
});
