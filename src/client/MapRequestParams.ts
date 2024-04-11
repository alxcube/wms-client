import type { ExceptionFormat } from "../wms-data-types/ExceptionFormat";
import type { RequestBoundingBox } from "../wms-data-types/RequestBoundingBox";

export interface LayerWithStyle {
  layer: string;
  style?: string;
}

export interface MapRequestParams {
  layers: LayerWithStyle[];
  crs: string;
  bounds: RequestBoundingBox;
  width: number;
  height: number;
  format: string;
  transparent?: boolean;
  bgColor?: string;
  exceptionsFormat?: ExceptionFormat | string;
  time?: number | string;
  elevation?: number | string;
  [key: string]: unknown;
}
