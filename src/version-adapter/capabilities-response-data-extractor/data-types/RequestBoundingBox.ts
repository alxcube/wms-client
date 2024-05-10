import type { BoundingBox } from "./BoundingBox";

/**
 * Request Bounding Box.
 * The value of the BoundingBox type is an object with the following props: `minX`, `minY`, `maxX`, `maxY`.
 * These values specify the minimum X, minimum Y, maximum X, and maximum Y values of a region in the Layer CRS of the
 * request. The units, ordering and direction of increment of the X and Y axes are as defined by the Layer CRS.
 */
export type RequestBoundingBox = Omit<BoundingBox, "crs" | "resX" | "resY">;
