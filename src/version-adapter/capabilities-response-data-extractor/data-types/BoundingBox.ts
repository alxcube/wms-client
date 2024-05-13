/**
 * BoundingBox states the bounding rectangle of the map data in a particular coordinate reference system.
 *
 * The `BoundingBox` metadata element has the following relationship to the `bounds` request parameter:
 * - The `BoundingBox` metadata element specifies the coordinate range for the layer as a whole.
 * - The `bounds` request parameter, on the other hand, specifies which area is to be portrayed on the map. The
 *   `bounds` area may or may not overlap, contain, or be contained within the `BoundingBox` area.
 *
 * NOTE There is no provision for describing disjoint bounding boxes. For example, consider a dataset which covers
 * two areas separated by some distance. The server cannot provide two separate bounding boxes in the same Layer using
 * the same CRS to separately describe those areas. To handle this type of situation, the server may either define a single
 * larger bounding box which encloses both areas, or may define two separate Layers that each have distinct Name and
 * `BoundingBox` values.
 */
export interface BoundingBox {
  /**
   * Indicates the Layer CRS that applies to this bounding box.
   */
  crs: string;

  /**
   * Indicate min limit of the bounding box `X` using the axis units of the specified CRS.
   */
  minX: number;

  /**
   * Indicate min limit of the bounding box `Y` using the axis units of the specified CRS.
   */
  minY: number;

  /**
   * Indicate max limit of the bounding box `X` using the axis units of the specified CRS.
   */
  maxX: number;

  /**
   * Indicate max limit of the bounding box `Y` using the axis units of the specified CRS.
   */
  maxY: number;

  /**
   * Indicate the spatial resolution along X-axis of the data comprising the layer in units of the specified CRS.
   */
  resX?: number;

  /**
   * Indicate the spatial resolution along Y-axis of the data comprising the layer in units of the specified CRS.
   */
  resY?: number;
}
