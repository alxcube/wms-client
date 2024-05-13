import type { ResourceUrl } from "./ResourceUrl";

/**
 * Object with URL of detailed, standardized metadata about the data corresponding to a particular layer.
 */
export interface MetadataUrl extends ResourceUrl {
  /**
   * Indicates the standard to which the metadata complies.
   */
  type: string;
}
