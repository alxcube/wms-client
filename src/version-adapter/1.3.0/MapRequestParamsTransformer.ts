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
          requestParams.layers = params[key]
            .map(({ layer }) => layer)
            .join(",");
          requestParams.styles = params[key]
            .map(({ style }) => style || "")
            .join(",");
          break;
        case "bounds":
          requestParams.bbox =
            params.crs.toLowerCase() === "epsg:4326"
              ? `${params[key].minY},${params[key].minX},${params[key].maxY},${params[key].maxX}`
              : `${params[key].minX},${params[key].minY},${params[key].maxX},${params[key].maxY}`;
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
}
