import { beforeEach, describe, expect, it, test } from "vitest";
import type { MapRequestParams } from "../../../../src/MapRequestParams";
import { MapRequestParamsTransformer } from "../../../../src/version-adapter/1.3.0/MapRequestParamsTransformer";
import { testContainer } from "../../../testContainer";

describe("MapRequestParamsTransformer v1.3.0 class", () => {
  let transformer: MapRequestParamsTransformer;

  beforeEach(() => {
    transformer = testContainer.resolve(
      "WmsMapRequestParamsTransformer",
      "1.3.0"
    ) as MapRequestParamsTransformer;
  });

  test("correct resolution from service container", () => {
    expect(transformer).toBeInstanceOf(MapRequestParamsTransformer);
  });

  describe("transform() method", () => {
    let layers: MapRequestParams["layers"];
    let crs: MapRequestParams["crs"];
    let bounds: MapRequestParams["bounds"];
    let width: MapRequestParams["width"];
    let height: MapRequestParams["height"];
    let format: MapRequestParams["format"];
    let transparent: MapRequestParams["transparent"];
    let bgColor: MapRequestParams["bgColor"];
    let exceptionsFormat: MapRequestParams["exceptionsFormat"];
    let time: MapRequestParams["time"];
    let elevation: MapRequestParams["elevation"];

    beforeEach(() => {
      layers = [
        { layer: "Layer1", style: "Style1" },
        { layer: "Layer2" },
        { layer: "Layer3", style: "Style3" },
      ];
      crs = "CRS:84";
      bounds = { minX: -10, minY: -20, maxX: 30, maxY: 40 };
      width = 100;
      height = 150;
      format = "image/png";
      transparent = false;
      bgColor = "0xffffff";
      exceptionsFormat = "INIMAGE";
      time = "2020/03/18";
      elevation = 1000;
    });

    it("should transform given MapRequestParams to object, compatible with WMS 1.3.0 GetMap request", () => {
      expect(
        transformer.transform({
          layers,
          crs,
          bounds,
          width,
          height,
          format,
          transparent,
          bgColor,
          exceptionsFormat,
          time,
          elevation,
          customParam: "some custom value",
        })
      ).toEqual({
        service: "WMS",
        request: "GetMap",
        version: "1.3.0",
        layers: "Layer1,Layer2,Layer3",
        styles: "Style1,,Style3",
        crs,
        bbox: "-10,-20,30,40",
        width,
        height,
        format,
        transparent: "FALSE",
        bgColor,
        exceptionsFormat,
        time,
        elevation,
        customParam: "some custom value",
      });
    });

    it("should change format of 'bbox' param from 'minX,minY,maxX,maxY' to 'minY,minX,maxY,maxX', when crs is 'EPSG:4326'", () => {
      const transformed = transformer.transform({
        crs: "EPSG:4326",
        bounds,
        width,
        height,
        format,
        layers,
      }) as { bbox: string };
      expect(transformed.bbox).toBe("-20,-10,40,30");
    });
  });
});
