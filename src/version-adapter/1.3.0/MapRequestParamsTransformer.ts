import type { MapRequestParams } from "../../MapRequestParams";
import type { WmsMapRequestParamsTransformer } from "../BaseWmsVersionAdapter";

export class MapRequestParamsTransformer
  implements WmsMapRequestParamsTransformer
{
  transform(params: MapRequestParams): object {
    const requestParams: { [key: string]: unknown } = {};

    Object.keys(params).forEach((key: keyof MapRequestParams) => {
      switch (key) {
        case "layers":
          requestParams.layers = this.getLayersParam(params[key]);
          requestParams.styles = this.getStylesParam(params[key]);
          break;
        case "bounds":
          requestParams.bbox = this.getBboxParam(params[key], params.crs);
          break;
        case "transparent":
          requestParams.transparent = params[key] ? "TRUE" : "FALSE";
          break;
        default:
          requestParams[key] = params[key];
          break;
      }
    });

    requestParams.version = "1.3.0";
    requestParams.service = "WMS";
    requestParams.request = "GetMap";

    return requestParams;
  }

  private getBboxParam(
    bounds: MapRequestParams["bounds"],
    crs: string
  ): string {
    return (
      crs.toLowerCase() === "epsg:4326"
        ? [bounds.minY, bounds.minX, bounds.maxY, bounds.maxX]
        : [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY]
    ).join(",");
  }

  private getLayersParam(layers: MapRequestParams["layers"]): string {
    return layers.map(({ layer }) => layer).join(",");
  }

  private getStylesParam(layers: MapRequestParams["layers"]): string {
    return layers.map(({ style }) => style || "").join(",");
  }
}
