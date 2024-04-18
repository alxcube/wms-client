import axios, { type AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, test } from "vitest";
import { BaseWmsNegotiator } from "../../../src/negotiator/BaseWmsNegotiator";
import { testContainer } from "../../testContainer";
import MockAdapter from "axios-mock-adapter";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_1_0 from "../../fixtures/capabilities_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_1_1 from "../../fixtures/capabilities_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_3_0 from "../../fixtures/capabilities_1_3_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import exceptionXml_1_3_0 from "../../fixtures/exceptions_1_3_0.xml?raw";

describe("BaseWmsNegotiator class", () => {
  let negotiator: BaseWmsNegotiator;
  let axiosInstance: AxiosInstance;
  let axiosMockAdapter: MockAdapter;
  const wmsUrl = "https://wms-example.com";

  beforeEach(() => {
    negotiator = testContainer.instantiate(BaseWmsNegotiator, [
      "WmsXmlParser",
      "XmlResponseVersionExtractor",
      "WmsClientFactory",
      "WmsVersionAdapterResolver",
      "RequestErrorHandler",
      "VersionComparator",
      "QueryParamsSerializer",
    ]);
    axiosInstance = axios.create();
    axiosMockAdapter = new MockAdapter(axiosInstance);
  });

  describe("negotiate() method", () => {
    it("should return WMS client v1.3.0, when server responds with capabilities XML v1.3.0", async () => {
      axiosMockAdapter.onGet().reply(200, capabilitiesXml_1_3_0);
      const client = await negotiator.negotiate(wmsUrl, {
        httpClient: axiosInstance,
      });
      expect(client.getVersion()).toBe("1.3.0");
    });

    it("should return WMS client v1.1.1, when server responds with capabilities XML v1.1.1", async () => {
      axiosMockAdapter.onGet().reply(200, capabilitiesXml_1_1_1);
      const client = await negotiator.negotiate(wmsUrl, {
        httpClient: axiosInstance,
      });
      expect(client.getVersion()).toBe("1.1.1");
    });

    it("should return WMS client v1.1.1, when server responds with capabilities XML v1.1.0", async () => {
      axiosMockAdapter.onGet().reply(200, capabilitiesXml_1_1_0);
      const client = await negotiator.negotiate(wmsUrl, {
        httpClient: axiosInstance,
      });
      expect(client.getVersion()).toBe("1.1.1");
    });

    it("should reject with RangeError, when server responds with version higher than 1.3.x", () => {
      const responseXml = `<WMS_Capabilities version="1.4.0"></WMS_Capabilities>`;
      axiosMockAdapter.onGet().reply(200, responseXml);
      expect(() =>
        negotiator.negotiate(wmsUrl, { httpClient: axiosInstance })
      ).rejects.toThrow(RangeError);
    });

    it("should reject with RangeError, when server responds with version lower than 1.1.0", () => {
      const responseXml = `<WMS_Capabilities version="1.0.0"></WMS_Capabilities>`;
      axiosMockAdapter.onGet().reply(200, responseXml);
      expect(() =>
        negotiator.negotiate(wmsUrl, { httpClient: axiosInstance })
      ).rejects.toThrow(RangeError);
    });

    it("should continue negotiation with lower version, when server responds with WMS exception", async () => {
      let respondedWithError = false;
      axiosMockAdapter.onGet().reply(() => {
        if (respondedWithError) {
          return [200, capabilitiesXml_1_1_1];
        } else {
          respondedWithError = true;
          return [200, exceptionXml_1_3_0];
        }
      });
      const client = await negotiator.negotiate(wmsUrl, {
        httpClient: axiosInstance,
      });
      expect(client.getVersion()).toBe("1.1.1");
    });

    test("multiple steps negotiation", async () => {
      const unsupportedHigherVersionXml = `<WMS_Capabilities version="1.4.0"></WMS_Capabilities>`;
      let negotiationTriesCounter = 0;
      axiosMockAdapter.onGet().reply(() => {
        let data: string;
        if (!negotiationTriesCounter) {
          /*
           * Negotiator request highest version first, which is 1.3.0 at the moment.
           * Reply with unsupported version, which is higher, than 1.3.0
           */
          data = unsupportedHigherVersionXml;
        } else {
          /*
           * On second step negotiator requests with lower version, than 1.3.0, which is 1.1.1.
           * Reply with XML v1.1.0, which is compatible with v1.1.1
           */
          data = capabilitiesXml_1_1_0;
        }
        negotiationTriesCounter++;
        return [200, data];
      });

      const client = await negotiator.negotiate(wmsUrl, {
        httpClient: axiosInstance,
      });
      expect(client.getVersion()).toBe("1.1.1");
    });
  });

  it("should set client's map request url from capabilities response", async () => {
    axiosMockAdapter.onGet().reply(200, capabilitiesXml_1_3_0);
    const client = await negotiator.negotiate(wmsUrl, {
      httpClient: axiosInstance,
    });
    expect(client.getMapRequestUrl()).toBe("http://hostname/path?");
  });

  it("should set client's feature info request url from capabilities response", async () => {
    axiosMockAdapter.onGet().reply(200, capabilitiesXml_1_3_0);
    const client = await negotiator.negotiate(wmsUrl, {
      httpClient: axiosInstance,
    });
    expect(client.getFeatureInfoRequestUrl()).toBe("http://hostname/path?");
  });
});
