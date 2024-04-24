import type { BoundingBox } from "./BoundingBox";

export type RequestBoundingBox = Omit<BoundingBox, "crs" | "resX" | "resY">;
