import axios, { type AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BaseWmsClient } from "../../../src/client/BaseWmsClient";
import { BaseWmsClientFactory } from "../../../src/client/BaseWmsClientFactory";
import type { MapRequestParams } from "../../../src/client/WmsClient";
import { WmsException } from "../../../src/error/WmsException";
import { WmsExceptionReport } from "../../../src/error/WmsExceptionReport";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_3_0 from "../../fixtures/capabilities_1_3_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionsXml_1_3_0 from "../../fixtures/exceptions_1_3_0.xml?raw";
import { testContainer } from "../../testContainer";

describe("BaseWmsClient class", () => {
  let factory: BaseWmsClientFactory;
  const wmsUrl = "http://wms-example.com/";
  let client_1_1: BaseWmsClient;
  let client_1_3: BaseWmsClient;
  let httpClient: AxiosInstance;
  let axiosMock: MockAdapter;
  const customQuery = { customString: "str", customNumber: 1 };
  const mapRequestParams: MapRequestParams = {
    layers: [
      { layer: "layer1", style: "style1" },
      { layer: "layer2" },
      { layer: "layer3", style: "style3" },
    ],
    crs: "CRS:84",
    bounds: { minX: -180, minY: -90, maxX: 180, maxY: 90 },
    width: 200,
    height: 100,
    format: "image/png",
    transparent: true,
    bgColor: "0xffffff",
    exceptionsFormat: "XML",
    customKey: "customValue",
  };

  beforeEach(() => {
    factory = testContainer.instantiate(BaseWmsClientFactory, [
      "WmsVersionAdapterResolver",
      "QueryParamsSerializer",
      "WmsXmlParser",
      "RequestErrorHandler",
      "TextDecoder",
    ]);
    httpClient = axios.create();
    axiosMock = new MockAdapter(httpClient);
    client_1_1 = factory.create(wmsUrl, "1.1.1");
    client_1_3 = factory.create(wmsUrl, "1.3.0", {
      httpClient,
      query: customQuery,
    });
  });

  afterEach(() => {
    axiosMock.restore();
  });

  describe("getVersion() method", () => {
    it("should return WMS version", () => {
      expect(client_1_3.getVersion()).toBe("1.3.0");
    });
  });

  describe("getWmsUrl() method", () => {
    it("should return given WMS url", () => {
      expect(client_1_3.getWmsUrl()).toBe(wmsUrl);
    });
  });

  describe("getCapabilities() method", () => {
    beforeEach(() => {
      axiosMock.onGet().reply(200, capabilitiesXml_1_3_0);
    });

    it("should return promise of UnifiedCapabilitiesResponse", async () => {
      const response = await client_1_3.getCapabilities();
      expect(response.version).toBe("1.3.0");
      expect(response.capability).toBeDefined();
      expect(response.service).toBeDefined();
    });

    it("should pass given custom query params to http client", async () => {
      const spy = vi.spyOn(httpClient, "get");
      await client_1_3.getCapabilities();
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("customString=str"),
        expect.objectContaining({ responseType: "text" })
      );
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("customNumber=1"),
        expect.objectContaining({ responseType: "text" })
      );
    });

    it("should throw WmsException when WMS server returns error response with single error in report with successful http code", () => {
      const errorXml = `<ServiceExceptionReport version="1.3.0" xmlns="http://www.opengis.net/ogc"><ServiceException>Error message</ServiceException></ServiceExceptionReport>`;
      axiosMock.reset();
      axiosMock.onGet().reply(200, errorXml);

      expect(() => client_1_3.getCapabilities()).rejects.toThrow(WmsException);
    });

    it("should throw WmsExceptionReport, when WMS server returns error response with multiple errors in report with successful http code", () => {
      axiosMock.reset();
      axiosMock.onGet().reply(200, exceptionsXml_1_3_0);

      expect(() => client_1_3.getCapabilities()).rejects.toThrow(
        WmsExceptionReport
      );
    });

    it("should throw, when WMS server returns not valid capabilities response with successful http code", () => {
      axiosMock.reset();
      axiosMock.onGet().reply(200, "");

      expect(() => client_1_3.getCapabilities()).rejects.toThrow();
    });

    it("should throw WmsException when WMS server returns error response with single error in report with error http code", () => {
      const errorXml = `<ServiceExceptionReport version="1.3.0" xmlns="http://www.opengis.net/ogc"><ServiceException>Error message</ServiceException></ServiceExceptionReport>`;
      axiosMock.reset();
      axiosMock.onGet().reply(400, errorXml, { "content-type": "text/xml" });

      expect(() => client_1_3.getCapabilities()).rejects.toThrow(WmsException);
    });

    it("should throw WmsExceptionReport, when WMS server returns error response with multiple errors in report with error http code", () => {
      axiosMock.reset();
      axiosMock
        .onGet()
        .reply(400, exceptionsXml_1_3_0, { "content-type": "text/xml" });

      expect(() => client_1_3.getCapabilities()).rejects.toThrow(
        WmsExceptionReport
      );
    });

    it("should throw, when WMS server returns not valid capabilities response with error http code", () => {
      axiosMock.reset();
      axiosMock.onGet().reply(400, "");

      expect(() => client_1_3.getCapabilities()).rejects.toThrow();
    });
  });

  describe("getCustomQueryParams() method", () => {
    it("should return params, passed via 'query' option", () => {
      expect(client_1_3.getCustomQueryParams()).toEqual(customQuery);
    });
  });

  describe("getMapRequestUrl() method", () => {
    it("should return WMS url, unless custom url was given", () => {
      expect(client_1_3.getMapRequestUrl()).toBe(client_1_3.getWmsUrl());
    });

    it("should return custom url, when custom url was given in options", () => {
      const customUrl = "http://map.wms-example.com";
      const client = factory.create(wmsUrl, "1.1.1", {
        mapRequestUrl: customUrl,
      });
      expect(client.getMapRequestUrl()).toBe(customUrl);
    });
  });

  describe("setMapRequestUrl() method", () => {
    it("should set GetMap request base url", () => {
      const url = "http://get-map-request.url";
      client_1_3.setMapRequestUrl(url);
      expect(client_1_3.getMapRequestUrl()).toBe(url);
      expect(client_1_3.getMapUrl(mapRequestParams)).toMatch(url);
    });
  });

  describe("getMapUrl() method", () => {
    it("should return map request url v1.1.1", () => {
      expect(client_1_1.getMapUrl(mapRequestParams)).toBe(
        "http://wms-example.com/?layers=layer1%2Clayer2%2Clayer3&styles=style1%2C%2Cstyle3&srs=CRS%3A84&bbox=-180%2C-90%2C180%2C90&width=200&height=100&format=image%2Fpng&transparent=TRUE&bgcolor=0xffffff&exceptions=application%2Fvnd.ogc.se_xml&customKey=customValue&version=1.1.1&service=WMS&request=GetMap"
      );
    });

    it("should return map request url v1.3.0", () => {
      expect(client_1_3.getMapUrl(mapRequestParams)).toBe(
        "http://wms-example.com/?customString=str&customNumber=1&layers=layer1%2Clayer2%2Clayer3&styles=style1%2C%2Cstyle3&crs=CRS%3A84&bbox=-180%2C-90%2C180%2C90&width=200&height=100&format=image%2Fpng&transparent=TRUE&bgcolor=0xffffff&exceptions=XML&customKey=customValue&version=1.3.0&service=WMS&request=GetMap"
      );
    });
  });

  describe("getMap() method", () => {
    it("should return ArrayBuffer of map image", async () => {
      axiosMock
        .onGet()
        .reply(200, new ArrayBuffer(0), { "content-type": "image/png" });
      expect(await client_1_3.getMap(mapRequestParams)).toBeInstanceOf(
        ArrayBuffer
      );
    });

    it("should reject with WmsExceptionReport, when response is WMS exception XML with multiple messages", () => {
      axiosMock
        .onGet()
        .reply(200, exceptionsXml_1_3_0, { "content-type": "text/xml" });
      expect(() => client_1_3.getMap(mapRequestParams)).rejects.toThrow(
        WmsExceptionReport
      );
    });

    it("should reject with WmsException, when response is WMS exception XML with single message", () => {
      // Use exception report v1.1.1 -- client should handle any known exception versions
      const exceptionXml =
        '<ServiceExceptionReport version="1.1.1">\n' +
        "  <ServiceException>\n" +
        "    Exception message\n" +
        "  </ServiceException>" +
        "</ServiceExceptionReport>";
      axiosMock
        .onGet()
        .reply(200, exceptionXml, { "content-type": "text/xml" });
      expect(() => client_1_3.getMap(mapRequestParams)).rejects.toThrow(
        WmsException
      );
    });
  });
});
