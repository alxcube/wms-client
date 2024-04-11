import { describe, expect, it } from "vitest";
import { inheritLayersData } from "../../../src/utils/inheritLayersData";
import type { Layer } from "../../../src/wms-data-types/get-capabilities-response/Layer";

describe("inheritLayersData() function", () => {
  it("should copy layers data from parent to child layers for each layer in layers array", () => {
    const layers: Layer[] = [
      {
        title: "Level1",
        queryable: true,
        crs: ["crs:1"],
        layers: [
          {
            title: "Level2-1",
            crs: ["crs:84"],
            layers: [
              {
                title: "Level3",
                queryable: false,
              },
            ],
          },
          { title: "Level2-2" },
        ],
      },
    ];

    inheritLayersData(layers);

    expect(layers).toEqual([
      {
        title: "Level1",
        queryable: true,
        crs: ["crs:1"],
        layers: [
          {
            title: "Level2-1",
            crs: ["crs:1", "crs:84"],
            queryable: true,
            layers: [
              { title: "Level3", queryable: false, crs: ["crs:1", "crs:84"] },
            ],
          },
          { title: "Level2-2", crs: ["crs:1"], queryable: true },
        ],
      },
    ]);
  });
});
