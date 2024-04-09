import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { LayersExtractorFactory } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/LayersExtractorFactory";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("LayersExtractorFactory class", () => {
  const xml_1_1 = `<Root>
<Layer>
    <Title>Acme Corp. Map Server</Title>
    <SRS>EPSG:4326</SRS>
    <AuthorityURL name="DIF_ID">
      <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html" />
    </AuthorityURL>
    <Layer>
      <Name>ROADS_RIVERS</Name> 
      <Title>Roads and Rivers</Title>
      <SRS>EPSG:26986</SRS> 
      <LatLonBoundingBox minx="-71.63" miny="41.75" maxx="-70.78" maxy="42.90"/>
      <BoundingBox SRS="EPSG:4326" minx="-71.63" miny="41.75" maxx="-70.78" maxy="42.90" resx="0.01" resy="0.01"/>
      <BoundingBox SRS="EPSG:26986" minx="189000" miny="834000" maxx="285000" maxy="962000" resx="1" resy="1" />
      <Attribution>
        <Title>State College University</Title>
        <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/" />
        <LogoURL width="100" height="100">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/icons/logo.gif" />
        </LogoURL>
      </Attribution>
      <Identifier authority="DIF_ID">123456</Identifier>
      <FeatureListURL>
        <Format>application/vnd.ogc.se_xml"</Format>
        <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/data/roads_rivers.gml" />
      </FeatureListURL>
      <Style>
        <Name>USGS</Name>
        <Title>USGS Topo Map Style</Title>
        <Abstract>Features are shown in a style like that used in USGS topographic maps.</Abstract>
        <LegendURL width="72" height="72">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/legends/usgs.gif" />
        </LegendURL>
        <StyleSheetURL>
          <Format>text/xsl</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/stylesheets/usgs.xsl" />
        </StyleSheetURL>
      </Style>
      <ScaleHint min="4000" max="35000"></ScaleHint>
      <Layer queryable="1">
        <Name>ROADS_1M</Name> 
        <Title>Roads at 1:1M scale</Title>
        <Abstract>Roads at a scale of 1 to 1 million.</Abstract>
        <KeywordList>
          <Keyword>road</Keyword>
          <Keyword>transportation</Keyword>
          <Keyword>atlas</Keyword>
        </KeywordList>
        <Identifier authority="DIF_ID">123456</Identifier>
        <MetadataURL type="FGDC">
          <Format>text/plain</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/metadata/roads.txt" />
        </MetadataURL>
        <MetadataURL type="FGDC">
           <Format>text/xml</Format>
           <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/metadata/roads.xml" />
        </MetadataURL>
        <Style>
            <Name>ATLAS</Name>
            <Title>Road atlas style</Title>
            <Abstract>Roads are shown in a style like that used in a commercial road atlas.</Abstract>
            <LegendURL width="72" height="72">
              <Format>image/gif</Format>
              <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/legends/atlas.gif" />
            </LegendURL>
        </Style>
      </Layer>
      <Layer queryable="1">
        <Name>RIVERS_1M</Name>
        <Title>Rivers at 1:1M scale</Title>
        <Abstract>Rivers at a scale of 1 to 1 million.</Abstract>
        <KeywordList>
          <Keyword>river</Keyword>
          <Keyword>canal</Keyword>
          <Keyword>waterway</Keyword>
        </KeywordList>
      </Layer>
    </Layer>
    <Layer queryable="1">
      <Title>Weather Forecast Data</Title>
      <SRS>EPSG:4326</SRS>
      <LatLonBoundingBox minx="-180" miny="-90" maxx="180" maxy="90" />
      <Dimension name="time" units="ISO8601" />
      <Extent name="time" default="2000-08-22">1999-01-01/2000-08-22/P1D</Extent>
      <Layer>
        <Name>Clouds</Name> 
        <Title>Forecast cloud cover</Title>
      </Layer>
      <Layer>
        <Name>Temperature</Name> 
        <Title>Forecast temperature</Title>
      </Layer>
      <Layer>
        <Name>Pressure</Name> 
        <Title>Forecast barometric pressure</Title>
         <Dimension name="time" units="ISO8601" />
         <Dimension name="elevation" units="EPSG:5030" />
         <Extent name="time" default="2000-08-22">1999-01-01/2000-08-22/P1D</Extent>
         <Extent name="elevation" default="0" nearestValue="1">0,1000,3000,5000,10000</Extent>
      </Layer>
    </Layer>
    <Layer opaque="1" noSubsets="1" fixedWidth="512" fixedHeight="256">
      <Name>ozone_image</Name>
      <Title>Global ozone distribution (1992)</Title>
      <LatLonBoundingBox minx="-180" miny="-90" maxx="180" maxy="90" />
      <Extent name="time" default="1992">1992</Extent>
    </Layer>
    <Layer cascaded="1">
      <Name>population</Name>
      <Title>World population, annual</Title>
      <LatLonBoundingBox minx="-180" miny="-90" maxx="180" maxy="90" />
      <Extent name="time" default="2000">1990/2000/P1Y</Extent>
    </Layer>
  </Layer>
</Root>`;

  const xml_1_3 = `
<Root xmlns="${wmsXmlNamespace}">
<Layer>
    <Title>Acme Corp. Map Server</Title>
    <CRS>CRS:84</CRS>
    <AuthorityURL name="DIF_ID">
      <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html" />
    </AuthorityURL>
    <Layer>
      <Name>ROADS_RIVERS</Name>
      <Title>Roads and Rivers</Title>
      <CRS>EPSG:26986</CRS>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-71.63</westBoundLongitude>
        <eastBoundLongitude>-70.78</eastBoundLongitude>
        <southBoundLatitude>41.75</southBoundLatitude>
        <northBoundLatitude>42.90</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84" minx="-71.63" miny="41.75" maxx="-70.78" maxy="42.90" resx="0.01" resy="0.01"/>
      <BoundingBox CRS="EPSG:26986" minx="189000" miny="834000" maxx="285000" maxy="962000" resx="1" resy="1" />
      <Attribution>
        <Title>State College University</Title>
        <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/" />
        <LogoURL width="100" height="100">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/icons/logo.gif" />
        </LogoURL>
      </Attribution>
      <Identifier authority="DIF_ID">123456</Identifier>
      <FeatureListURL>
        <Format>XML"</Format>
        <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
         xlink:href="http://www.university.edu/data/roads_rivers.gml" />
      </FeatureListURL>
      <Style>
        <Name>USGS</Name>
        <Title>USGS Topo Map Style</Title>
        <Abstract>Features are shown in a style like that used in USGS topographic maps.</Abstract>
        <LegendURL width="72" height="72">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/legends/usgs.gif" />
        </LegendURL>
        <StyleSheetURL>
          <Format>text/xsl</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/stylesheets/usgs.xsl" />
        </StyleSheetURL>
      </Style>
      <Layer queryable="1">
        <Name>ROADS_1M</Name>
        <Title>Roads at 1:1M scale</Title>
        <Abstract>Roads at a scale of 1 to 1 million.</Abstract>
        <KeywordList>
          <Keyword>road</Keyword>
          <Keyword>transportation</Keyword>
          <Keyword>atlas</Keyword>
        </KeywordList>
        <Identifier authority="DIF_ID">123456</Identifier>
        <MetadataURL type="FGDC:1998">
          <Format>text/plain</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/metadata/roads.txt" />
        </MetadataURL>
        <MetadataURL type="ISO19115:2003">
          <Format>text/xml</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/metadata/roads.xml" />
        </MetadataURL>
        <Style>
          <Name>ATLAS</Name>
          <Title>Road atlas style</Title>
          <Abstract>Roads are shown in a style like that used in a commercial road atlas.</Abstract>
          <LegendURL width="72" height="72">
            <Format>image/gif</Format>
            <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/legends/atlas.gif" />
          </LegendURL>
        </Style>
      </Layer>
      <Layer queryable="1">
        <Name>RIVERS_1M</Name>
        <Title>Rivers at 1:1M scale</Title>
        <Abstract>Rivers at a scale of 1 to 1 million.</Abstract>
        <KeywordList>
          <Keyword>river</Keyword>
          <Keyword>canal</Keyword>
          <Keyword>waterway</Keyword>
        </KeywordList>
      </Layer>
    </Layer>
    <Layer queryable="1">
      <Title>Weather Forecast Data</Title>
      <CRS>CRS:84</CRS>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-90</southBoundLatitude>
        <northBoundLatitude>90</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <Dimension name="time" units="ISO8601" default="2000-08-22">1999-01-01/2000-08-22/P1D</Dimension>
      <Layer>
        <Name>Clouds</Name>
        <Title>Forecast cloud cover</Title>
      </Layer>
      <Layer>
        <Name>Temperature</Name>
        <Title>Forecast temperature</Title>
      </Layer>
      <Layer>
        <Name>Pressure</Name>
        <Title>Forecast barometric pressure</Title>
        <Dimension name="elevation" units="EPSG:5030" />
        <Dimension name="time" units="ISO8601" default="2000-08-22">1999-01-01/2000-08-22/P1D</Dimension>
        <Dimension name="elevation" units="CRS:88" default="0" nearestValue="1">0,1000,3000,5000,10000</Dimension>
      </Layer>
    </Layer>
    <Layer opaque="1" noSubsets="1" fixedWidth="512" fixedHeight="256">
      <Name>ozone_image</Name>
      <Title>Global ozone distribution (1992)</Title>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-90</southBoundLatitude>
        <northBoundLatitude>90</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <Dimension name="time" units="ISO8601" default="1992">1992</Dimension>
    </Layer>
    <Layer cascaded="1">
      <Name>population</Name>
      <Title>World population, annual</Title>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-90</southBoundLatitude>
        <northBoundLatitude>90</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <Dimension name="time" units="ISO8601" default="2000">1990/2000/P1Y</Dimension>
    </Layer>
  </Layer>
</Root>`;

  let factory_1_1: LayersExtractorFactory;
  let factory_1_3: LayersExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let contextNode_1_1: Element;
  let contextNode_1_3: Element;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(
      LayersExtractorFactory,
      [
        { service: "XmlDataExtractor<Keyword[]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[crs]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[dimensions]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[geographicBounds]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[boundingBoxes]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[attribution]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[authorityUrls]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[identifiers]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[metadataUrls]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[dataUrls]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[featureListUrls]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[styles]>", name: "1.1.1" },
        constant(""),
      ],
      { name: "1.1.1" }
    );
    testContainer.registerClass(
      LayersExtractorFactory,
      [
        { service: "XmlDataExtractor<Keyword[]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[crs]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[dimensions]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[geographicBounds]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[boundingBoxes]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[attribution]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[authorityUrls]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[identifiers]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[metadataUrls]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[dataUrls]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[featureListUrls]>", name: "1.3.0" },
        { service: "XmlDataExtractor<Layer[styles]>", name: "1.3.0" },
        constant("wms"),
      ],
      { name: "1.3.0" }
    );

    factory_1_1 = testContainer.resolve(LayersExtractorFactory, "1.1.1");
    factory_1_3 = testContainer.resolve(LayersExtractorFactory, "1.3.0");

    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    contextNode_1_1 = select(
      "/Root",
      xmlParser.parseFromString(xml_1_1, "text/xml"),
      true
    ) as Element;

    contextNode_1_3 = select(
      "/wms:Root",
      xmlParser.parseFromString(xml_1_3, "text/xml"),
      true
    ) as Element;
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("createNodeDataExtractor() method", () => {
    it("should create SingleNodeDataExtractorFn, which returns Layer objects array from context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(contextNode_1_1, select)).toEqual([
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
      ]);
    });

    it("should create SingleNodeDataExtractorFn, which returns Layer objects array from context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(contextNode_1_3, select)).toEqual([
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
      ]);
    });
  });
});
