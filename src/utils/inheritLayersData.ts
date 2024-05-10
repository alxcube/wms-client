import type { Layer } from "../version-adapter";
import { inheritLayerData } from "./inheritLayerData";

/**
 * Recursively inherits layer data in Layer array, extracted from GetCapabilities response XML, according to WMS
 * specification.
 *
 * @param layers
 */
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
