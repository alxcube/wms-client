import type { Layer } from "../wms-data-types/Layer";

export function inheritLayerData(layer: Layer, parentLayer: Layer): Layer {
  if (parentLayer.styles) {
    if (layer.styles) {
      layer.styles = [...parentLayer.styles, ...layer.styles];
    } else {
      layer.styles = [...parentLayer.styles];
    }
  }

  if (parentLayer.crs) {
    if (layer.crs) {
      // Merges parent and current layer crs codes, removing duplicates
      layer.crs = [...new Set([...parentLayer.crs, ...layer.crs])];
    } else {
      layer.crs = [...parentLayer.crs];
    }
  }

  if (parentLayer.geographicBounds && !layer.geographicBounds) {
    layer.geographicBounds = { ...parentLayer.geographicBounds };
  }

  if (parentLayer.boundingBoxes && !layer.boundingBoxes) {
    layer.boundingBoxes = [...parentLayer.boundingBoxes];
  }

  if (parentLayer.dimensions && !layer.dimensions) {
    layer.dimensions = [...parentLayer.dimensions];
  }

  if (parentLayer.attribution && !layer.attribution) {
    layer.attribution = { ...parentLayer.attribution };
  }

  if (parentLayer.authorityUrls) {
    if (layer.authorityUrls) {
      layer.authorityUrls = [
        ...parentLayer.authorityUrls,
        ...layer.authorityUrls,
      ];
    } else {
      layer.authorityUrls = [...parentLayer.authorityUrls];
    }
  }

  if (
    parentLayer.minScaleDenominator !== undefined &&
    layer.minScaleDenominator === undefined
  ) {
    layer.minScaleDenominator = parentLayer.minScaleDenominator;
  }

  if (
    parentLayer.maxScaleDenominator !== undefined &&
    layer.maxScaleDenominator === undefined
  ) {
    layer.maxScaleDenominator = parentLayer.maxScaleDenominator;
  }

  if (parentLayer.queryable !== undefined && layer.queryable === undefined) {
    layer.queryable = parentLayer.queryable;
  }

  if (parentLayer.cascaded !== undefined && layer.cascaded === undefined) {
    layer.cascaded = parentLayer.cascaded;
  }

  if (parentLayer.opaque !== undefined && layer.opaque === undefined) {
    layer.opaque = parentLayer.opaque;
  }

  if (parentLayer.noSubsets !== undefined && layer.noSubsets === undefined) {
    layer.noSubsets = parentLayer.noSubsets;
  }

  if (parentLayer.fixedWidth !== undefined && layer.fixedWidth === undefined) {
    layer.fixedWidth = parentLayer.fixedWidth;
  }

  if (
    parentLayer.fixedHeight !== undefined &&
    layer.fixedHeight === undefined
  ) {
    layer.fixedHeight = parentLayer.fixedHeight;
  }

  if (layer.layers) {
    for (const childLayer of layer.layers) {
      inheritLayerData(childLayer, layer);
    }
  }

  return layer;
}
