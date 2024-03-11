import { describe, expect, it } from "vitest";
import { inheritLayerData } from "../../../src/utils/inheritLayerData";

import type { Layer } from "../../../src/wms-data-types/Layer";

describe("inheritLayerData() function", () => {
  it("should copy layer styles from parent layer, when child layer has no own styles", () => {
    const parent: Layer = {
      title: "parent",
      styles: [{ name: "style1", title: "Style1" }],
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(child.styles).toEqual(parent.styles);
    expect(parent.styles).toEqual([{ name: "style1", title: "Style1" }]);
  });

  it("should merge parent layer styles and child layer styles, when both has styles", () => {
    const parent: Layer = {
      title: "parent",
      styles: [{ name: "style1", title: "Style1" }],
    };

    const child: Layer = {
      title: "child",
      styles: [{ name: "style2", title: "Style2" }],
    };

    inheritLayerData(child, parent);

    expect(child.styles).toEqual([
      { name: "style1", title: "Style1" },
      { name: "style2", title: "Style2" },
    ]);
    expect(parent.styles).toEqual([{ name: "style1", title: "Style1" }]);
  });

  it("should not change styles, when parent has no styles and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      styles: [{ name: "style2", title: "Style2" }],
    };

    inheritLayerData(child, parent);

    expect(parent.styles).toBeUndefined();
    expect(child.styles).toEqual([{ name: "style2", title: "Style2" }]);
  });

  it("should copy crs from parent layer to child layer, when parent layer has crs, and child layer has no crs", () => {
    const parent: Layer = {
      title: "parent",
      crs: ["crs:1"],
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.crs).toEqual(["crs:1"]);
    expect(child.crs).toEqual(parent.crs);
  });

  it("should merge unique parent and child layer crs, when parent layer and child layer both has crs", () => {
    const parent: Layer = {
      title: "parent",
      crs: ["crs:1", "epsg:3807"],
    };

    const child: Layer = {
      title: "child",
      crs: ["crs:1", "crs:84"],
    };

    inheritLayerData(child, parent);

    expect(child.crs).toEqual(["crs:1", "epsg:3807", "crs:84"]);
    expect(parent.crs).toEqual(["crs:1", "epsg:3807"]);
  });

  it("should not change crs, when parent layer has no crs, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      crs: ["crs:1"],
    };

    inheritLayerData(child, parent);

    expect(child.crs).toEqual(["crs:1"]);
    expect(parent.crs).toBeUndefined();
  });

  it("should copy geographicBounds to child layer, when parent layer has geographicBounds, and child layer hasn't", () => {
    const parent: Layer = {
      title: "parent",
      geographicBounds: { west: -180, east: 180, south: -90, north: 90 },
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.geographicBounds).toEqual({
      west: -180,
      east: 180,
      south: -90,
      north: 90,
    });
    expect(child.geographicBounds).toEqual(parent.geographicBounds);
  });

  it("should not change geographicBounds, when both layers has geographicBounds", () => {
    const parent: Layer = {
      title: "parent",
      geographicBounds: { west: -180, east: 180, south: -90, north: 90 },
    };

    const child: Layer = {
      title: "child",
      geographicBounds: { west: -90, east: 90, south: -45, north: 45 },
    };

    inheritLayerData(child, parent);

    expect(child.geographicBounds).toEqual({
      west: -90,
      east: 90,
      south: -45,
      north: 45,
    });
    expect(parent.geographicBounds).toEqual({
      west: -180,
      east: 180,
      south: -90,
      north: 90,
    });
  });

  it("should not change geographicBounds, when parent layer has no geographicBounds, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      geographicBounds: { west: -90, east: 90, south: -45, north: 45 },
    };

    inheritLayerData(child, parent);

    expect(child.geographicBounds).toEqual({
      west: -90,
      east: 90,
      south: -45,
      north: 45,
    });
    expect(parent.geographicBounds).toBeUndefined();
  });

  it("should copy boundingBoxes from parent layer when parentLayer has bounding boxes, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      boundingBoxes: [{ crs: "crs:1", minX: 0, minY: 0, maxX: 10, maxY: 10 }],
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(child.boundingBoxes).toEqual(parent.boundingBoxes);
    expect(parent.boundingBoxes).toEqual([
      { crs: "crs:1", minX: 0, minY: 0, maxX: 10, maxY: 10 },
    ]);
  });

  it("should not change boundingBoxes, when child and parent layer both has boundingBoxes", () => {
    const parent: Layer = {
      title: "parent",
      boundingBoxes: [{ crs: "crs:1", minX: 0, minY: 0, maxX: 10, maxY: 10 }],
    };

    const child: Layer = {
      title: "child",
      boundingBoxes: [{ crs: "crs:1", minX: 2, minY: 2, maxX: 20, maxY: 20 }],
    };

    inheritLayerData(child, parent);

    expect(child.boundingBoxes).toEqual([
      { crs: "crs:1", minX: 2, minY: 2, maxX: 20, maxY: 20 },
    ]);
    expect(parent.boundingBoxes).toEqual([
      { crs: "crs:1", minX: 0, minY: 0, maxX: 10, maxY: 10 },
    ]);
  });

  it("should not change boundingBoxes, when child has boundingBoxes and parent has not", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      boundingBoxes: [{ crs: "crs:1", minX: 2, minY: 2, maxX: 20, maxY: 20 }],
    };

    inheritLayerData(child, parent);

    expect(child.boundingBoxes).toEqual([
      { crs: "crs:1", minX: 2, minY: 2, maxX: 20, maxY: 20 },
    ]);
    expect(parent.boundingBoxes).toBeUndefined();
  });

  it("should copy dimensions from parent layer, when parent layer has dimensions and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      dimensions: [{ name: "dim", units: "units" }],
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.dimensions).toEqual([{ name: "dim", units: "units" }]);
    expect(child.dimensions).toEqual(parent.dimensions);
  });

  it("should not change dimensions when parent and child layers both has dimensions", () => {
    const parent: Layer = {
      title: "parent",
      dimensions: [{ name: "dim", units: "units" }],
    };

    const child: Layer = {
      title: "child",
      dimensions: [{ name: "dim1", units: "units1" }],
    };

    inheritLayerData(child, parent);

    expect(parent.dimensions).toEqual([{ name: "dim", units: "units" }]);
    expect(child.dimensions).toEqual([{ name: "dim1", units: "units1" }]);
  });

  it("should not change dimensions when parent layer has not dimensions and child layers has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      dimensions: [{ name: "dim1", units: "units1" }],
    };

    inheritLayerData(child, parent);

    expect(parent.dimensions).toBeUndefined();
    expect(child.dimensions).toEqual([{ name: "dim1", units: "units1" }]);
  });

  it("should copy attribution to child layer, when child layer has no attribution, and parent layer has", () => {
    const parent: Layer = {
      title: "parent",
      attribution: { title: "attribution1" },
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.attribution).toEqual({ title: "attribution1" });
    expect(child.attribution).toEqual(parent.attribution);
  });

  it("should not change attribution, when parent and child layers both has attribution", () => {
    const parent: Layer = {
      title: "parent",
      attribution: { title: "attribution1" },
    };

    const child: Layer = {
      title: "child",
      attribution: { title: "attribution2" },
    };

    inheritLayerData(child, parent);

    expect(parent.attribution).toEqual({ title: "attribution1" });
    expect(child.attribution).toEqual({ title: "attribution2" });
  });

  it("should not change attribution, when parent layer has no attribution and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      attribution: { title: "attribution2" },
    };

    inheritLayerData(child, parent);

    expect(parent.attribution).toBeUndefined();
    expect(child.attribution).toEqual({ title: "attribution2" });
  });

  it("should copy authorityUrls when child layer has no authorityUrls, and parent layer has", () => {
    const parent: Layer = {
      title: "parent",
      authorityUrls: [
        {
          name: "url1",
          url: "http://localhost",
        },
      ],
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.authorityUrls).toEqual([
      {
        name: "url1",
        url: "http://localhost",
      },
    ]);
    expect(child.authorityUrls).toEqual(parent.authorityUrls);
  });

  it("should merge authorityUrls, when parent and child layers both has authorityUrls", () => {
    const parent: Layer = {
      title: "parent",
      authorityUrls: [
        {
          name: "url1",
          url: "http://localhost",
        },
      ],
    };

    const child: Layer = {
      title: "child",
      authorityUrls: [
        {
          name: "url2",
          url: "https://localhost",
        },
      ],
    };

    inheritLayerData(child, parent);

    expect(parent.authorityUrls).toEqual([
      {
        name: "url1",
        url: "http://localhost",
      },
    ]);
    expect(child.authorityUrls).toEqual([
      { name: "url1", url: "http://localhost" },
      { name: "url2", url: "https://localhost" },
    ]);
  });

  it("should not change authorityUrls when child layer has authority urls, and parent layer has not", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      authorityUrls: [
        {
          name: "url2",
          url: "https://localhost",
        },
      ],
    };

    inheritLayerData(child, parent);

    expect(parent.authorityUrls).toBeUndefined();
    expect(child.authorityUrls).toEqual([
      { name: "url2", url: "https://localhost" },
    ]);
  });

  it("should copy minScaleDenominator value, when parent layer has minScaleDenominator, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      minScaleDenominator: 1,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.minScaleDenominator).toBe(1);
    expect(child.minScaleDenominator).toBe(1);
  });

  it("should not change minScaleDenominator, when parent and child layers both has minScaleDenominator", () => {
    const parent: Layer = {
      title: "parent",
      minScaleDenominator: 1,
    };

    const child: Layer = {
      title: "child",
      minScaleDenominator: 2,
    };

    inheritLayerData(child, parent);

    expect(parent.minScaleDenominator).toBe(1);
    expect(child.minScaleDenominator).toBe(2);
  });

  it("should not change minScaleDenominator, when parent layer has no minScaleDenominator, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      minScaleDenominator: 2,
    };

    inheritLayerData(child, parent);

    expect(parent.minScaleDenominator).toBeUndefined();
    expect(child.minScaleDenominator).toBe(2);
  });

  it("should copy maxScaleDenominator value, when parent layer has maxScaleDenominator, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      maxScaleDenominator: 1,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.maxScaleDenominator).toBe(1);
    expect(child.maxScaleDenominator).toBe(1);
  });

  it("should not change maxScaleDenominator, when parent and child layers both has maxScaleDenominator", () => {
    const parent: Layer = {
      title: "parent",
      maxScaleDenominator: 1,
    };

    const child: Layer = {
      title: "child",
      maxScaleDenominator: 2,
    };

    inheritLayerData(child, parent);

    expect(parent.maxScaleDenominator).toBe(1);
    expect(child.maxScaleDenominator).toBe(2);
  });

  it("should not change maxScaleDenominator, when parent layer has no maxScaleDenominator, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      maxScaleDenominator: 2,
    };

    inheritLayerData(child, parent);

    expect(parent.maxScaleDenominator).toBeUndefined();
    expect(child.maxScaleDenominator).toBe(2);
  });

  it("should copy queryable value, when parent layer has queryable, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      queryable: true,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.queryable).toBe(true);
    expect(child.queryable).toBe(true);
  });

  it("should not change queryable, when parent and child layers both has queryable", () => {
    const parent: Layer = {
      title: "parent",
      queryable: true,
    };

    const child: Layer = {
      title: "child",
      queryable: false,
    };

    inheritLayerData(child, parent);

    expect(parent.queryable).toBe(true);
    expect(child.queryable).toBe(false);
  });

  it("should not change queryable, when parent layer has no queryable, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      queryable: true,
    };

    inheritLayerData(child, parent);

    expect(parent.queryable).toBeUndefined();
    expect(child.queryable).toBe(true);
  });

  it("should copy cascaded value, when parent layer has cascaded, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      cascaded: 1,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.cascaded).toBe(1);
    expect(child.cascaded).toBe(1);
  });

  it("should not change cascaded, when parent and child layers both has cascaded", () => {
    const parent: Layer = {
      title: "parent",
      cascaded: 1,
    };

    const child: Layer = {
      title: "child",
      cascaded: 2,
    };

    inheritLayerData(child, parent);

    expect(parent.cascaded).toBe(1);
    expect(child.cascaded).toBe(2);
  });

  it("should not change cascaded, when parent layer has no cascaded, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      cascaded: 1,
    };

    inheritLayerData(child, parent);

    expect(parent.cascaded).toBeUndefined();
    expect(child.cascaded).toBe(1);
  });

  it("should copy noSubsets value, when parent layer has noSubsets, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      noSubsets: true,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.noSubsets).toBe(true);
    expect(child.noSubsets).toBe(true);
  });

  it("should not change noSubsets, when parent and child layers both has noSubsets", () => {
    const parent: Layer = {
      title: "parent",
      noSubsets: true,
    };

    const child: Layer = {
      title: "child",
      noSubsets: false,
    };

    inheritLayerData(child, parent);

    expect(parent.noSubsets).toBe(true);
    expect(child.noSubsets).toBe(false);
  });

  it("should not change noSubsets, when parent layer has no noSubsets, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      noSubsets: true,
    };

    inheritLayerData(child, parent);

    expect(parent.noSubsets).toBeUndefined();
    expect(child.noSubsets).toBe(true);
  });

  it("should copy opaque value, when parent layer has opaque, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      opaque: true,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.opaque).toBe(true);
    expect(child.opaque).toBe(true);
  });

  it("should not change opaque, when parent and child layers both has opaque", () => {
    const parent: Layer = {
      title: "parent",
      opaque: true,
    };

    const child: Layer = {
      title: "child",
      opaque: false,
    };

    inheritLayerData(child, parent);

    expect(parent.opaque).toBe(true);
    expect(child.opaque).toBe(false);
  });

  it("should not change opaque, when parent layer has no opaque, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      opaque: true,
    };

    inheritLayerData(child, parent);

    expect(parent.opaque).toBeUndefined();
    expect(child.opaque).toBe(true);
  });

  it("should copy fixedWidth value, when parent layer has fixedWidth, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      fixedWidth: 1,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.fixedWidth).toBe(1);
    expect(child.fixedWidth).toBe(1);
  });

  it("should not change fixedWidth, when parent and child layers both has fixedWidth", () => {
    const parent: Layer = {
      title: "parent",
      fixedWidth: 1,
    };

    const child: Layer = {
      title: "child",
      fixedWidth: 2,
    };

    inheritLayerData(child, parent);

    expect(parent.fixedWidth).toBe(1);
    expect(child.fixedWidth).toBe(2);
  });

  it("should not change fixedWidth, when parent layer has no fixedWidth, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      fixedWidth: 1,
    };

    inheritLayerData(child, parent);

    expect(parent.fixedWidth).toBeUndefined();
    expect(child.fixedWidth).toBe(1);
  });

  it("should copy fixedHeight value, when parent layer has fixedHeight, and child layer has not", () => {
    const parent: Layer = {
      title: "parent",
      fixedHeight: 1,
    };

    const child: Layer = {
      title: "child",
    };

    inheritLayerData(child, parent);

    expect(parent.fixedHeight).toBe(1);
    expect(child.fixedHeight).toBe(1);
  });

  it("should not change fixedHeight, when parent and child layers both has fixedHeight", () => {
    const parent: Layer = {
      title: "parent",
      fixedHeight: 1,
    };

    const child: Layer = {
      title: "child",
      fixedHeight: 2,
    };

    inheritLayerData(child, parent);

    expect(parent.fixedHeight).toBe(1);
    expect(child.fixedHeight).toBe(2);
  });

  it("should not change fixedHeight, when parent layer has no fixedHeight, and child layer has", () => {
    const parent: Layer = {
      title: "parent",
    };

    const child: Layer = {
      title: "child",
      fixedHeight: 1,
    };

    inheritLayerData(child, parent);

    expect(parent.fixedHeight).toBeUndefined();
    expect(child.fixedHeight).toBe(1);
  });
});
