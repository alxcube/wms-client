import axios, { type AxiosError, isAxiosError } from "axios";
import { beforeEach, describe, expect, it } from "vitest";
import {
  BaseRequestErrorHandler,
  WmsException,
  WmsExceptionReport,
} from "../../../src";
import { testContainer } from "../../testContainer";
import MockAdapter from "axios-mock-adapter";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_1_0 from "../../fixtures/exception_1_1_0.xml?raw";

async function getAxiosError(
  data: string,
  contentType = "text/xml"
): Promise<AxiosError> {
  const axiosInstance = axios.create();
  const mockAdapter = new MockAdapter(axiosInstance);
  mockAdapter.onAny().reply(400, data, { "content-type": contentType });
  try {
    await axiosInstance.get("");
  } catch (e) {
    if (isAxiosError(e)) {
      return e;
    }
  }
  throw new Error("Couldn't get axios error");
}
describe("BaseRequestErrorHandler class", () => {
  let handler: BaseRequestErrorHandler;

  beforeEach(() => {
    handler = testContainer.instantiate(BaseRequestErrorHandler, [
      "TextDecoder",
      "WmsXmlParser",
    ]);
  });

  describe("handleRequestError() method", () => {
    it("should rethrow given error, when given not AxiosError", () => {
      const typeError = new TypeError("Test");
      try {
        handler.handleRequestError(typeError);
      } catch (e) {
        expect(e).toBe(typeError);
      }
      expect.hasAssertions();
    });

    it("should rethrow given error, when given AxiosError with not WMS exception response", async () => {
      const error = await getAxiosError(`<Message>Not exception XML</Message>`);
      try {
        handler.handleRequestError(error);
      } catch (e) {
        expect(e).toBe(error);
      }
      expect.hasAssertions();
    });

    it("should throw WmsExceptionReport, when given AxiosError with WMS exception report with multiple exceptions", async () => {
      const error = await getAxiosError(exceptionXml_1_1_0);
      try {
        handler.handleRequestError(error);
      } catch (e) {
        expect(e).not.toBe(error);
        expect(e).toBeInstanceOf(WmsExceptionReport);
      }
      expect.hasAssertions();
    });

    it("should throw WmsException, when given AxiosError with WMS exception report with single exception", async () => {
      const error = await getAxiosError(
        `<ServiceExceptionReport version="1.1.0"><ServiceException>Message</ServiceException></ServiceExceptionReport>`
      );
      try {
        handler.handleRequestError(error);
      } catch (e) {
        expect(e).not.toBe(error);
        expect(e).toBeInstanceOf(WmsException);
      }
      expect.hasAssertions();
    });
  });
});
