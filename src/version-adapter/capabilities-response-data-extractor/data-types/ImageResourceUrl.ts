import type { ResourceUrl } from "./ResourceUrl";

/**
 * Image Resource URL.
 */
export interface ImageResourceUrl extends ResourceUrl {
  /**
   * Image width.
   */
  width: number;

  /**
   * Image height.
   */
  height: number;
}
