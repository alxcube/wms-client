import { constant } from "@alxcube/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  CapabilitiesSectionExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../src";
import { testContainer } from "../../../testContainer";
// eslint-disable-next-line import/no-unresolved
import xml_1_1 from "../../../fixtures/capabilities_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import xml_1_3 from "../../../fixtures/capabilities_1_3_0.xml?raw";

describe("CapabilitiesSectionExtractor class", () => {
  let factory_1_1: CapabilitiesSectionExtractor;
  let factory_1_3: CapabilitiesSectionExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let doc_1_1: Document;
  let doc_1_3: Document;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(CapabilitiesSectionExtractor, [
      { service: "XmlDataExtractor<Layer[]>", name: "1.1.1" },
      { service: "XmlDataExtractor<ExceptionFormat[]>", name: "1.1.1" },
      constant("WMT_MS_Capabilities"),
      constant(""),
    ]);
    factory_1_3 = testContainer.instantiate(CapabilitiesSectionExtractor, [
      { service: "XmlDataExtractor<Layer[]>", name: "1.3.0" },
      { service: "XmlDataExtractor<ExceptionFormat[]>", name: "1.3.0" },
      constant("WMS_Capabilities"),
      constant("wms"),
    ]);

    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    doc_1_1 = xmlParser.parseFromString(xml_1_1, "text/xml");
    doc_1_3 = xmlParser.parseFromString(xml_1_3, "text/xml");
  });

  describe("createNodeDataExtractor() method", () => {
    it("should create SingleNodeDataExtractorFn, which returns UnifiedCapabilitiesResponse.capability section from xml v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(doc_1_1, select)).toEqual({
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
      });
    });

    it("should create SingleNodeDataExtractorFn, which returns UnifiedCapabilitiesResponse.capability section from xml v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(doc_1_3, select)).toEqual({
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
      });
    });
  });
});
