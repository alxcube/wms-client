import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BaseWmsClient } from "../../src/BaseWmsClient";
import { createClient } from "../../src/createClient";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_3_0 from "../fixtures/capabilities_1_3_0.xml?raw";

describe("BaseWmsClient class", () => {
  let client: BaseWmsClient;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    client = createClient("http://wms-example.com", "1.3.0");
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
    it("should return promise of UnifiedCapabilitiesResponse", async () => {
      axiosMock.onGet().reply(200, capabilitiesXml_1_3_0);

      const response = await client.getCapabilities();
      expect(response.version).toBe("1.3.0");
      expect(response.capability).toBeDefined();
      expect(response.service).toBeDefined();
    });
  });
});
