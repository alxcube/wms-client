export interface BoundingBox {
  crs: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  resX?: number;
  resY?: number;
}
