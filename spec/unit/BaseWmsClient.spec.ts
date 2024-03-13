import axios, { type AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BaseWmsClient } from "../../src/BaseWmsClient";
import { createClient } from "../../src/createClient";
import { WmsException } from "../../src/error/WmsException";
import { WmsExceptionReport } from "../../src/error/WmsExceptionReport";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_3_0 from "../fixtures/capabilities_1_3_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionsXml_1_3_0 from "../fixtures/exceptions_1_3_0.xml?raw";

describe("BaseWmsClient class", () => {
  const wmsUrl = "http://wms-example.com?";
  let client: BaseWmsClient;
  let httpClient: AxiosInstance;
  let axiosMock: MockAdapter;
  const customQuery = { customString: "str", customNumber: 1 };

  beforeEach(() => {
    httpClient = axios.create();
    axiosMock = new MockAdapter(httpClient);
    client = createClient(wmsUrl, "1.3.0", {
      httpClient,
      query: customQuery,
    });
  });

  afterEach(() => {
    axiosMock.restore();
  });

  describe("getVersion() method", () => {
    it("should return WMS version", () => {
      expect(client.getVersion()).toBe("1.3.0");
    });
  });

  describe("getCapabilities() method", () => {
    beforeEach(() => {
      axiosMock.onGet().reply(200, capabilitiesXml_1_3_0);
    });

    it("should return promise of UnifiedCapabilitiesResponse", async () => {
      const response = await client.getCapabilities();
      expect(response.version).toBe("1.3.0");
      expect(response.capability).toBeDefined();
      expect(response.service).toBeDefined();
    });

    it("should pass given custom query params to http client", async () => {
      const spy = vi.spyOn(httpClient, "get");
      await client.getCapabilities();
      expect(spy).toHaveBeenCalledWith(
        wmsUrl,
        expect.objectContaining({
          params: expect.objectContaining(customQuery),
        })
      );
    });

    it("should throw WmsException when WMS server returns error response with single error in report with successful http code", () => {
      const errorXml = `<ServiceExceptionReport version="1.3.0" xmlns="http://www.opengis.net/ogc"><ServiceException>Error message</ServiceException></ServiceExceptionReport>`;
      axiosMock.reset();
      axiosMock.onGet().reply(200, errorXml);

      expect(() => client.getCapabilities()).rejects.toThrow(WmsException);
    });

    it("should throw WmsExceptionReport, when WMS server returns error response with multiple errors in report with successful http code", () => {
      axiosMock.reset();
      axiosMock.onGet().reply(200, exceptionsXml_1_3_0);

      expect(() => client.getCapabilities()).rejects.toThrow(
        WmsExceptionReport
      );
    });

    it("should throw, when WMS server returns not valid capabilities response with successful http code", () => {
      axiosMock.reset();
      axiosMock.onGet().reply(200, "");

      expect(() => client.getCapabilities()).rejects.toThrow();
    });

    it("should throw WmsException when WMS server returns error response with single error in report with error http code", () => {
      const errorXml = `<ServiceExceptionReport version="1.3.0" xmlns="http://www.opengis.net/ogc"><ServiceException>Error message</ServiceException></ServiceExceptionReport>`;
      axiosMock.reset();
      axiosMock.onGet().reply(400, errorXml);

      expect(() => client.getCapabilities()).rejects.toThrow(WmsException);
    });

    it("should throw WmsExceptionReport, when WMS server returns error response with multiple errors in report with error http code", () => {
      axiosMock.reset();
      axiosMock.onGet().reply(400, exceptionsXml_1_3_0);

      expect(() => client.getCapabilities()).rejects.toThrow(
        WmsExceptionReport
      );
    });

    it("should throw, when WMS server returns not valid capabilities response with error http code", () => {
      axiosMock.reset();
      axiosMock.onGet().reply(400, "");

      expect(() => client.getCapabilities()).rejects.toThrow();
    });
  });

  describe("getCustomQueryParams() method", () => {
    it("should return params, passed via 'query' option", () => {
      expect(client.getCustomQueryParams()).toEqual(customQuery);
    });
  });
});
