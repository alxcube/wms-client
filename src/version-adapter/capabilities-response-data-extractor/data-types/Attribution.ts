import type { ImageResourceUrl } from "./ImageResourceUrl";

/**
 * The `Attribution` object provides a way to identify the source of the geographic information used in a Layer.
 */
export interface Attribution {
  /**
   * Human-readable string naming the data provider
   */
  title?: string;

  /**
   * Data provider's URL.
   */
  url?: string;

  /**
   * The resource of logo image.
   */
  logo?: ImageResourceUrl;
}
