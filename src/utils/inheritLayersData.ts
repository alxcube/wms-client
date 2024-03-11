import type { Layer } from "../wms-data-types/Layer";
import { inheritLayerData } from "./inheritLayerData";

export function inheritLayersData(layers: Layer[]): Layer[] {
  for (const layer of layers) {
    if (layer.layers) {
      for (const childLayer of layer.layers) {
        inheritLayerData(childLayer, layer);
      }
    }
  }
  return layers;
}
