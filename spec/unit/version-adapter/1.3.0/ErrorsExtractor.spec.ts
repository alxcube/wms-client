import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ErrorsExtractor } from "../../../../src/version-adapter/1.3.0/ErrorsExtractor";
import { testContainer } from "../../../testContainer";
// eslint-disable-next-line import/no-unresolved
import exceptions_1_3_0 from "../../../fixtures/exceptions_1_3_0.xml?raw";
import { DOMParser } from "@xmldom/xmldom";

describe("ErrorsExtractor v1.3.0 class", () => {
  let xmlParser: DOMParser;
  let errorsDoc: Document;
  let extractor: ErrorsExtractor;

  beforeEach(() => {
    testContainer.backup();
    testContainer.registerClass(ErrorsExtractor, []);
    xmlParser = new DOMParser();
    errorsDoc = xmlParser.parseFromString(exceptions_1_3_0, "text/xml");
    extractor = testContainer.resolve(ErrorsExtractor);
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("extract() method", () => {
    it("should extract WmsError objects array from error xml response", () => {
      const errors = extractor.extract(errorsDoc);
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
  });
});
