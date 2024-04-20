import { beforeEach, describe, expect, it } from "vitest";
import xpath from "xpath";
import { CapabilitiesSectionExtractor_1_0 } from "../../../../src/version-adapter/capabilities-response-data-extractor/CapabilitiesSectionExtractor_1_0";
import { testContainer } from "../../../testContainer";
// eslint-disable-next-line import/no-unresolved
import xml from "../../../fixtures/capabilities_1_0_0.xml?raw";

describe("CapabilitiesSectionExtractor_1_0 class", () => {
  let factory: CapabilitiesSectionExtractor_1_0;
  let xmlParser: DOMParser;
  let responseDoc: Document;

  beforeEach(() => {
    factory = testContainer.instantiate(CapabilitiesSectionExtractor_1_0, [
      { service: "XmlDataExtractor<Layer[]>", name: "1.0.0" },
    ]);
    xmlParser = testContainer.resolve("DOMParser");
    responseDoc = xmlParser.parseFromString(xml, "text/xml");
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns UnifiedCapabilitiesResponse['capability'] object from xml response v1.0.0", () => {
      const extract = factory.createNodeDataExtractor();
      expect(extract(responseDoc, xpath.select)).toEqual({
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
      });
    });
  });
});
