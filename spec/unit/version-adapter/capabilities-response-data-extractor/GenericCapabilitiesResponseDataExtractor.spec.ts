import { beforeEach, describe, expect, it } from "vitest";
import { constant } from "../../../../src/service-container/constant";
import { serviceContainer } from "../../../../src/serviceContainer";
import type { UnifiedCapabilitiesResponse } from "../../../../src/wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";
import { GenericCapabilitiesResponseDataExtractor } from "../../../../src/version-adapter/capabilities-response-data-extractor/GenericCapabilitiesResponseDataExtractor";
import { testContainer } from "../../../testContainer";
import { DOMParser } from "@xmldom/xmldom";
// eslint-disable-next-line import/no-unresolved
import capabilities_1_1_1 from "../../../fixtures/capabilities_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilities_1_1_0 from "../../../fixtures/capabilities_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilities_1_3_0 from "../../../fixtures/capabilities_1_3_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilities_1_0_0 from "../../../fixtures/capabilities_1_0_0.xml?raw";

describe("GenericCapabilitiesResponseDataExtractor class", () => {
  let xmlParser: DOMParser;
  let capabilitiesResponseDocument_1_1_1: Document;
  let capabilitiesResponseDocument_1_1_0: Document;
  let capabilitiesResponseDocument_1_3_0: Document;
  let capabilitiesResponseDocument_1_0_0: Document;
  let extractor_1_1_1: GenericCapabilitiesResponseDataExtractor;
  let extractor_1_3_0: GenericCapabilitiesResponseDataExtractor;
  let extractor_1_0_0: GenericCapabilitiesResponseDataExtractor;

  beforeEach(() => {
    xmlParser = new DOMParser();
    capabilitiesResponseDocument_1_1_1 = xmlParser.parseFromString(
      capabilities_1_1_1,
      "text/xml"
    );
    capabilitiesResponseDocument_1_1_0 = xmlParser.parseFromString(
      capabilities_1_1_0,
      "text/xml"
    );
    capabilitiesResponseDocument_1_3_0 = xmlParser.parseFromString(
      capabilities_1_3_0,
      "text/xml"
    );
    capabilitiesResponseDocument_1_0_0 = xmlParser.parseFromString(
      capabilities_1_0_0,
      "text/xml"
    );
    extractor_1_1_1 = testContainer.instantiate(
      GenericCapabilitiesResponseDataExtractor,
      [
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
          name: "1.1.1",
        },
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
          name: "1.1.1",
        },
        constant({
          xlink: "http://www.w3.org/1999/xlink",
        }),
      ]
    );
    extractor_1_3_0 = testContainer.instantiate(
      GenericCapabilitiesResponseDataExtractor,
      [
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
          name: "1.3.0",
        },
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
          name: "1.3.0",
        },
        constant({
          xlink: "http://www.w3.org/1999/xlink",
          wms: "http://www.opengis.net/wms",
        }),
      ]
    );

    extractor_1_0_0 = serviceContainer.instantiate(
      GenericCapabilitiesResponseDataExtractor,
      [
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
          name: "1.0.0",
        },
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
          name: "1.0.0",
        },
        constant({}),
      ]
    );
  });

  describe("extractVersion() method", () => {
    it("should extract WMS GetCapabilities response from XML response v1.1.1 and return UnifiedCapabilitiesResponse", () => {
      const response = extractor_1_1_1.extract(
        capabilitiesResponseDocument_1_1_1
      );
      const expected: UnifiedCapabilitiesResponse = {
        version: "1.1.1",
        updateSequence: "0",
        service: {
          title: "Acme Corp. Map Server",
          description:
            "WMT Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.",
          keywords: [
            { value: "bird" },
            { value: "roadrunner" },
            { value: "ambush" },
          ],
          url: "http://hostname/",
          contactInformation: {
            contactPerson: {
              name: "Jeff deLaBeaujardiere",
              organization: "NASA",
            },
            position: "Computer Scientist",
            address: {
              addressType: "postal",
              address: "NASA Goddard Space Flight Center, Code 933",
              city: "Greenbelt",
              stateOrProvince: "MD",
              postCode: "20771",
              country: "USA",
            },
            telephone: "+1 301 286-1569",
            fax: "+1 301 286-1777",
            email: "delabeau@iniki.gsfc.nasa.gov",
          },
          fees: "none",
          accessConstraints: "none",
        },
        capability: {
          request: {
            getCapabilities: {
              responseFormats: ["application/vnd.ogc.wms_xml"],
              httpGetUrl: "http://hostname:port/path",
            },
            getMap: {
              responseFormats: ["image/gif", "image/png", "image/jpeg"],
              httpGetUrl: "http://hostname:port/path",
            },
            getFeatureInfo: {
              responseFormats: [
                "application/vnd.ogc.gml",
                "text/plain",
                "text/html",
              ],
              httpGetUrl: "http://hostname:port/path",
            },
            describeLayer: {
              responseFormats: ["application/vnd.ogc.gml"],
              httpGetUrl: "http://hostname:port/path",
            },
          },
          exceptionFormats: ["XML", "INIMAGE", "BLANK"],
          layers: [
            {
              title: "Acme Corp. Map Server",
              crs: ["EPSG:4326"],
              authorityUrls: [
                {
                  name: "DIF_ID",
                  url: "http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html",
                },
              ],
              layers: [
                {
                  name: "ROADS_RIVERS",
                  title: "Roads and Rivers",
                  crs: ["EPSG:26986"],
                  geographicBounds: {
                    west: -71.63,
                    east: -70.78,
                    south: 41.75,
                    north: 42.9,
                  },
                  boundingBoxes: [
                    {
                      crs: "EPSG:4326",
                      minX: -71.63,
                      minY: 41.75,
                      maxX: -70.78,
                      maxY: 42.9,
                      resX: 0.01,
                      resY: 0.01,
                    },
                    {
                      crs: "EPSG:26986",
                      minX: 189000,
                      minY: 834000,
                      maxX: 285000,
                      maxY: 962000,
                      resX: 1,
                      resY: 1,
                    },
                  ],
                  attribution: {
                    title: "State College University",
                    url: "http://www.university.edu/",
                    logo: {
                      width: 100,
                      height: 100,
                      format: "image/gif",
                      url: "http://www.university.edu/icons/logo.gif",
                    },
                  },
                  identifiers: [{ authority: "DIF_ID", value: "123456" }],
                  featureListUrls: [
                    {
                      format: 'application/vnd.ogc.se_xml"',
                      url: "http://www.university.edu/data/roads_rivers.gml",
                    },
                  ],
                  styles: [
                    {
                      name: "USGS",
                      title: "USGS Topo Map Style",
                      description:
                        "Features are shown in a style like that used in USGS topographic maps.",
                      legendUrls: [
                        {
                          width: 72,
                          height: 72,
                          format: "image/gif",
                          url: "http://www.university.edu/legends/usgs.gif",
                        },
                      ],
                      stylesheetUrl: {
                        format: "text/xsl",
                        url: "http://www.university.edu/stylesheets/usgs.xsl",
                      },
                    },
                  ],
                  scaleHint: { min: 4000, max: 35000 },
                  layers: [
                    {
                      queryable: true,
                      name: "ROADS_1M",
                      title: "Roads at 1:1M scale",
                      description: "Roads at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "road" },
                        { value: "transportation" },
                        { value: "atlas" },
                      ],
                      identifiers: [{ authority: "DIF_ID", value: "123456" }],
                      metadataUrls: [
                        {
                          type: "FGDC",
                          format: "text/plain",
                          url: "http://www.university.edu/metadata/roads.txt",
                        },
                        {
                          type: "FGDC",
                          format: "text/xml",
                          url: "http://www.university.edu/metadata/roads.xml",
                        },
                      ],
                      styles: [
                        {
                          name: "ATLAS",
                          title: "Road atlas style",
                          description:
                            "Roads are shown in a style like that used in a commercial road atlas.",
                          legendUrls: [
                            {
                              width: 72,
                              height: 72,
                              format: "image/gif",
                              url: "http://www.university.edu/legends/atlas.gif",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      queryable: true,
                      name: "RIVERS_1M",
                      title: "Rivers at 1:1M scale",
                      description: "Rivers at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "river" },
                        { value: "canal" },
                        { value: "waterway" },
                      ],
                    },
                  ],
                },
                {
                  queryable: true,
                  title: "Weather Forecast Data",
                  crs: ["EPSG:4326"],
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "2000-08-22",
                      value: "1999-01-01/2000-08-22/P1D",
                    },
                  ],
                  layers: [
                    {
                      name: "Clouds",
                      title: "Forecast cloud cover",
                    },
                    {
                      name: "Temperature",
                      title: "Forecast temperature",
                    },
                    {
                      name: "Pressure",
                      title: "Forecast barometric pressure",
                      dimensions: [
                        {
                          name: "time",
                          units: "ISO8601",
                          default: "2000-08-22",
                          value: "1999-01-01/2000-08-22/P1D",
                        },
                        {
                          name: "elevation",
                          units: "EPSG:5030",
                          default: "0",
                          nearestValue: true,
                          value: "0,1000,3000,5000,10000",
                        },
                      ],
                    },
                  ],
                },
                {
                  opaque: true,
                  noSubsets: true,
                  fixedWidth: 512,
                  fixedHeight: 256,
                  name: "ozone_image",
                  title: "Global ozone distribution (1992)",
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "1992",
                      value: "1992",
                    },
                  ],
                },
                {
                  cascaded: 1,
                  name: "population",
                  title: "World population, annual",
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "2000",
                      value: "1990/2000/P1Y",
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      expect(response).toEqual(expected);
    });

    it("should extract WMS GetCapabilities response from XML response v1.1.0 and return UnifiedCapabilitiesResponse", () => {
      const response = extractor_1_1_1.extract(
        capabilitiesResponseDocument_1_1_0
      );
      const expected: UnifiedCapabilitiesResponse = {
        version: "1.1.0",
        updateSequence: "0",
        service: {
          title: "Acme Corp. Map Server",
          description:
            "WMT Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.",
          keywords: [
            { value: "bird" },
            { value: "roadrunner" },
            { value: "ambush" },
          ],
          url: "http://hostname/",
          contactInformation: {
            contactPerson: {
              name: "Jeff deLaBeaujardiere",
              organization: "NASA",
            },
            position: "Computer Scientist",
            address: {
              addressType: "postal",
              address: "NASA Goddard Space Flight Center, Code 933",
              city: "Greenbelt",
              stateOrProvince: "MD",
              postCode: "20771",
              country: "USA",
            },
            telephone: "+1 301 286-1569",
            fax: "+1 301 286-1777",
            email: "delabeau@iniki.gsfc.nasa.gov",
          },
          fees: "none",
          accessConstraints: "none",
        },
        capability: {
          request: {
            getCapabilities: {
              responseFormats: ["application/vnd.ogc.wms_xml"],
              httpGetUrl: "http://hostname:port/path",
            },
            getMap: {
              responseFormats: ["image/gif", "image/png", "image/jpeg"],
              httpGetUrl: "http://hostname:port/path",
            },
            getFeatureInfo: {
              responseFormats: [
                "application/vnd.ogc.gml",
                "text/plain",
                "text/html",
              ],
              httpGetUrl: "http://hostname:port/path",
            },
            describeLayer: {
              responseFormats: ["application/vnd.ogc.gml"],
              httpGetUrl: "http://hostname:port/path",
            },
          },
          exceptionFormats: ["XML", "INIMAGE", "BLANK"],
          layers: [
            {
              title: "Acme Corp. Map Server",
              crs: ["EPSG:4326"],
              authorityUrls: [
                {
                  name: "DIF_ID",
                  url: "http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html",
                },
              ],
              layers: [
                {
                  name: "ROADS_RIVERS",
                  title: "Roads and Rivers",
                  crs: ["EPSG:26986"],
                  geographicBounds: {
                    west: -71.63,
                    east: -70.78,
                    south: 41.75,
                    north: 42.9,
                  },
                  boundingBoxes: [
                    {
                      crs: "EPSG:4326",
                      minX: -71.63,
                      minY: 41.75,
                      maxX: -70.78,
                      maxY: 42.9,
                      resX: 0.01,
                      resY: 0.01,
                    },
                    {
                      crs: "EPSG:26986",
                      minX: 189000,
                      minY: 834000,
                      maxX: 285000,
                      maxY: 962000,
                      resX: 1,
                      resY: 1,
                    },
                  ],
                  attribution: {
                    title: "State College University",
                    url: "http://www.university.edu/",
                    logo: {
                      width: 100,
                      height: 100,
                      format: "image/gif",
                      url: "http://www.university.edu/icons/logo.gif",
                    },
                  },
                  identifiers: [{ authority: "DIF_ID", value: "123456" }],
                  featureListUrls: [
                    {
                      format: 'application/vnd.ogc.se_xml"',
                      url: "http://www.university.edu/data/roads_rivers.gml",
                    },
                  ],
                  styles: [
                    {
                      name: "USGS",
                      title: "USGS Topo Map Style",
                      description:
                        "Features are shown in a style like that used in USGS topographic maps.",
                      legendUrls: [
                        {
                          width: 72,
                          height: 72,
                          format: "image/gif",
                          url: "http://www.university.edu/legends/usgs.gif",
                        },
                      ],
                      stylesheetUrl: {
                        format: "text/xsl",
                        url: "http://www.university.edu/stylesheets/usgs.xsl",
                      },
                    },
                  ],
                  scaleHint: { min: 4000, max: 35000 },
                  layers: [
                    {
                      queryable: true,
                      name: "ROADS_1M",
                      title: "Roads at 1:1M scale",
                      description: "Roads at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "road" },
                        { value: "transportation" },
                        { value: "atlas" },
                      ],
                      identifiers: [{ authority: "DIF_ID", value: "123456" }],
                      metadataUrls: [
                        {
                          type: "FGDC",
                          format: "text/plain",
                          url: "http://www.university.edu/metadata/roads.txt",
                        },
                        {
                          type: "FGDC",
                          format: "text/xml",
                          url: "http://www.university.edu/metadata/roads.xml",
                        },
                      ],
                      styles: [
                        {
                          name: "ATLAS",
                          title: "Road atlas style",
                          description:
                            "Roads are shown in a style like that used in a commercial road atlas.",
                          legendUrls: [
                            {
                              width: 72,
                              height: 72,
                              format: "image/gif",
                              url: "http://www.university.edu/legends/atlas.gif",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      queryable: true,
                      name: "RIVERS_1M",
                      title: "Rivers at 1:1M scale",
                      description: "Rivers at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "river" },
                        { value: "canal" },
                        { value: "waterway" },
                      ],
                    },
                  ],
                },
                {
                  queryable: true,
                  title: "Weather Forecast Data",
                  crs: ["EPSG:4326"],
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "2000-08-22",
                      value: "1999-01-01/2000-08-22/P1D",
                    },
                  ],
                  layers: [
                    {
                      name: "Clouds",
                      title: "Forecast cloud cover",
                    },
                    {
                      name: "Temperature",
                      title: "Forecast temperature",
                    },
                    {
                      name: "Pressure",
                      title: "Forecast barometric pressure",
                      dimensions: [
                        {
                          name: "time",
                          units: "ISO8601",
                          default: "2000-08-22",
                          value: "1999-01-01/2000-08-22/P1D",
                        },
                        {
                          name: "elevation",
                          units: "EPSG:5030",
                          default: "0",
                          value: "0,1000,3000,5000,10000",
                        },
                      ],
                    },
                  ],
                },
                {
                  opaque: true,
                  noSubsets: true,
                  fixedWidth: 512,
                  fixedHeight: 256,
                  name: "ozone_image",
                  title: "Global ozone distribution (1992)",
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "1992",
                      value: "1992",
                    },
                  ],
                },
                {
                  cascaded: 1,
                  name: "population",
                  title: "World population, annual",
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "2000",
                      value: "1990/2000/P1Y",
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      expect(response).toEqual(expected);
    });

    it("should extract WMS GetCapabilities response from XML response v1.3.0 and return UnifiedCapabilitiesResponse", () => {
      const response = extractor_1_3_0.extract(
        capabilitiesResponseDocument_1_3_0
      );
      const expected: UnifiedCapabilitiesResponse = {
        version: "1.3.0",
        service: {
          title: "Acme Corp. Map Server",
          description:
            "Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.",
          keywords: [
            { value: "bird" },
            { value: "roadrunner" },
            { value: "ambush" },
          ],
          url: "http://hostname/",
          contactInformation: {
            contactPerson: {
              name: "Jeff Smith",
              organization: "NASA",
            },
            position: "Computer Scientist",
            address: {
              addressType: "postal",
              address: "NASA Goddard Space Flight Center",
              city: "Greenbelt",
              stateOrProvince: "MD",
              postCode: "20771",
              country: "USA",
            },
            telephone: "+1 301 555-1212",
            email: "user@host.com",
          },
          fees: "none",
          accessConstraints: "none",
          layerLimit: 16,
          maxWidth: 2048,
          maxHeight: 2048,
        },
        capability: {
          request: {
            getCapabilities: {
              responseFormats: ["text/xml"],
              httpGetUrl: "http://hostname/path?",
            },
            getMap: {
              responseFormats: ["image/gif", "image/png", "image/jpeg"],
              httpGetUrl: "http://hostname/path?",
            },
            getFeatureInfo: {
              responseFormats: ["text/xml", "text/plain", "text/html"],
              httpGetUrl: "http://hostname/path?",
            },
          },
          exceptionFormats: ["XML", "INIMAGE", "BLANK"],
          layers: [
            {
              title: "Acme Corp. Map Server",
              crs: ["CRS:84"],
              authorityUrls: [
                {
                  name: "DIF_ID",
                  url: "http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html",
                },
              ],
              layers: [
                {
                  name: "ROADS_RIVERS",
                  title: "Roads and Rivers",
                  crs: ["EPSG:26986"],
                  geographicBounds: {
                    west: -71.63,
                    east: -70.78,
                    south: 41.75,
                    north: 42.9,
                  },
                  boundingBoxes: [
                    {
                      crs: "CRS:84",
                      minX: -71.63,
                      minY: 41.75,
                      maxX: -70.78,
                      maxY: 42.9,
                      resX: 0.01,
                      resY: 0.01,
                    },
                    {
                      crs: "EPSG:26986",
                      minX: 189000,
                      minY: 834000,
                      maxX: 285000,
                      maxY: 962000,
                      resX: 1,
                      resY: 1,
                    },
                  ],
                  attribution: {
                    title: "State College University",
                    url: "http://www.university.edu/",
                    logo: {
                      width: 100,
                      height: 100,
                      format: "image/gif",
                      url: "http://www.university.edu/icons/logo.gif",
                    },
                  },
                  identifiers: [{ authority: "DIF_ID", value: "123456" }],
                  featureListUrls: [
                    {
                      format: 'XML"',
                      url: "http://www.university.edu/data/roads_rivers.gml",
                    },
                  ],
                  styles: [
                    {
                      name: "USGS",
                      title: "USGS Topo Map Style",
                      description:
                        "Features are shown in a style like that used in USGS topographic maps.",
                      legendUrls: [
                        {
                          width: 72,
                          height: 72,
                          format: "image/gif",
                          url: "http://www.university.edu/legends/usgs.gif",
                        },
                      ],
                      stylesheetUrl: {
                        format: "text/xsl",
                        url: "http://www.university.edu/stylesheets/usgs.xsl",
                      },
                    },
                  ],
                  layers: [
                    {
                      queryable: true,
                      name: "ROADS_1M",
                      title: "Roads at 1:1M scale",
                      description: "Roads at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "road" },
                        { value: "transportation" },
                        { value: "atlas" },
                      ],
                      identifiers: [{ authority: "DIF_ID", value: "123456" }],
                      metadataUrls: [
                        {
                          type: "FGDC:1998",
                          format: "text/plain",
                          url: "http://www.university.edu/metadata/roads.txt",
                        },
                        {
                          type: "ISO19115:2003",
                          format: "text/xml",
                          url: "http://www.university.edu/metadata/roads.xml",
                        },
                      ],
                      styles: [
                        {
                          name: "ATLAS",
                          title: "Road atlas style",
                          description:
                            "Roads are shown in a style like that used in a commercial road atlas.",
                          legendUrls: [
                            {
                              width: 72,
                              height: 72,
                              format: "image/gif",
                              url: "http://www.university.edu/legends/atlas.gif",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      queryable: true,
                      name: "RIVERS_1M",
                      title: "Rivers at 1:1M scale",
                      description: "Rivers at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "river" },
                        { value: "canal" },
                        { value: "waterway" },
                      ],
                    },
                  ],
                },
                {
                  queryable: true,
                  title: "Weather Forecast Data",
                  crs: ["CRS:84"],
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "2000-08-22",
                      value: "1999-01-01/2000-08-22/P1D",
                    },
                  ],
                  layers: [
                    {
                      name: "Clouds",
                      title: "Forecast cloud cover",
                    },
                    {
                      name: "Temperature",
                      title: "Forecast temperature",
                    },
                    {
                      name: "Pressure",
                      title: "Forecast barometric pressure",
                      dimensions: [
                        {
                          name: "elevation",
                          units: "EPSG:5030",
                          value: "",
                        },
                        {
                          name: "time",
                          units: "ISO8601",
                          default: "2000-08-22",
                          value: "1999-01-01/2000-08-22/P1D",
                        },
                        {
                          name: "elevation",
                          units: "CRS:88",
                          default: "0",
                          nearestValue: true,
                          value: "0,1000,3000,5000,10000",
                        },
                      ],
                    },
                  ],
                },
                {
                  opaque: true,
                  noSubsets: true,
                  fixedWidth: 512,
                  fixedHeight: 256,
                  name: "ozone_image",
                  title: "Global ozone distribution (1992)",
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "1992",
                      value: "1992",
                    },
                  ],
                },
                {
                  cascaded: 1,
                  name: "population",
                  title: "World population, annual",
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  dimensions: [
                    {
                      name: "time",
                      units: "ISO8601",
                      default: "2000",
                      value: "1990/2000/P1Y",
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      expect(response).toEqual(expected);
    });

    it("should extract WMS GetCapabilities response from XML response v1.0.0 and return UnifiedCapabilitiesResponse", () => {
      const response = extractor_1_0_0.extract(
        capabilitiesResponseDocument_1_0_0
      );

      const expected: UnifiedCapabilitiesResponse = {
        version: "1.0.0",
        updateSequence: "0",
        service: {
          title: "Acme Corp. Map Server",
          description:
            "WMT Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.",
          keywords: [
            { value: "bird" },
            { value: "roadrunner" },
            { value: "ambush" },
          ],
          url: "http://hostname:port/path/",
          fees: "none",
          accessConstraints: "none",
        },
        capability: {
          request: {
            getCapabilities: {
              responseFormats: ["WMS_XML"],
              httpGetUrl: "http://hostname:port/path/mapserver.cgi",
            },
            getMap: {
              responseFormats: ["SGI", "GIF", "JPEG", "PNG", "WebCGM", "SVG"],
              httpGetUrl: "http://hostname:port/path/mapserver.cgi",
            },
            getFeatureInfo: {
              responseFormats: ["MIME", "GML.1"],
              httpGetUrl: "http://hostname:port/path/mapserver.cgi",
            },
          },
          exceptionFormats: ["BLANK", "XML"],
          layers: [
            {
              title: "Acme Corp. Map Server",
              crs: ["EPSG:4326"],
              layers: [
                {
                  queryable: false,
                  name: "wmt_graticule",
                  title: "Alignment test grid",
                  description:
                    "The WMT Graticule is a 10-degree grid suitable for testing alignment among Map Servers.",
                  keywords: [{ value: "graticule" }, { value: "test" }],
                  geographicBounds: {
                    east: 180,
                    north: 90,
                    south: -90,
                    west: -180,
                  },
                  styles: [
                    {
                      name: "on",
                      title: "Show test grid",
                      description:
                        'The "on" style for the WMT Graticule causes that layer to be displayed.',
                    },
                    {
                      name: "off",
                      title: "Hide test grid",
                      description:
                        'The "off" style for the WMT Graticule causes that layer to be hidden even though it was requested from the Map Server.  Style=off is the same as not requesting the graticule at all.',
                    },
                  ],
                },
                {
                  name: "ROADS_RIVERS",
                  title: "Roads and Rivers",
                  crs: ["EPSG:26986"],
                  geographicBounds: {
                    west: -71.634696,
                    south: 41.754149,
                    east: -70.789798,
                    north: 42.908459,
                  },
                  boundingBoxes: [
                    {
                      crs: "EPSG:26986",
                      minX: 189000,
                      minY: 834000,
                      maxX: 285000,
                      maxY: 962000,
                    },
                  ],
                  styles: [
                    {
                      name: "USGS Topo",
                      title: "Topo map style",
                      description:
                        "Features are shown in a style like that used in USGS topographic maps.",
                      styleUrl: { format: "", url: "" },
                    },
                  ],
                  scaleHint: { min: 4000, max: 35000 },
                  layers: [
                    {
                      queryable: true,
                      name: "ROADS_1M",
                      title: "Roads at 1:1M scale",
                      description: "Roads at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "road" },
                        { value: "transportation" },
                        { value: "atlas" },
                      ],
                      dataUrls: [
                        { format: "", url: "http://www.opengis.org?roads.xml" },
                      ],
                      styles: [
                        {
                          name: "Rand McNally",
                          title: "Road atlas style",
                          description:
                            "Roads are shown in a style like that used in a Rand McNally road atlas.",
                        },
                      ],
                    },
                    {
                      queryable: true,
                      name: "RIVERS_1M",
                      title: "Rivers at 1:1M scale",
                      description: "Rivers at a scale of 1 to 1 million.",
                      keywords: [
                        { value: "river" },
                        { value: "canal" },
                        { value: "water" },
                      ],
                      dataUrls: [
                        {
                          format: "",
                          url: "http://www.opengis.org?rivers.xml",
                        },
                      ],
                    },
                  ],
                },
                {
                  queryable: true,
                  title: "Weather Data",
                  crs: ["EPSG:4326"],
                  geographicBounds: {
                    west: -180,
                    east: 180,
                    south: -90,
                    north: 90,
                  },
                  styles: [
                    {
                      name: "default",
                      title: "Default style",
                      description:
                        "Weather Data are only available in a single default style.",
                    },
                  ],
                  layers: [
                    {
                      name: "Clouds",
                      title: "Forecast cloud cover",
                    },
                    {
                      name: "Temperature",
                      title: "Forecast temperature",
                    },
                    {
                      name: "Pressure",
                      title: "Forecast barometric pressure",
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      expect(response).toEqual(expected);
    });
  });
});
