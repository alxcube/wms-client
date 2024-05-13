/**
 * `GeographicBoundingBox` states the minimum bounding rectangle in decimal degrees of the area covered by the Layer.
 * `GeographicBoundingBox` shall be supplied regardless of what CRS the map server may support, but it may be
 * approximate if the data are not natively in geographic coordinates. The purpose of `GeographicBoundingBox` is to
 * facilitate geographic searches without requiring coordinate transformations by the search engine.
 */
export interface GeographicBoundingBox {
  /**
   * Max latitude.
   */
  north: number;

  /**
   * Min latitude.
   */
  south: number;

  /**
   * Min longitude.
   */
  west: number;

  /**
   * Max longitude.
   */
  east: number;
}
