import type { ImageResourceUrl } from "./ImageResourceUrl";
import type { ResourceUrl } from "./ResourceUrl";

type StyleSheetUrl = ResourceUrl;
type StyleUrl = ResourceUrl;

/**
 * Metadata of particular layer styles.
 *
 * Zero or more styles may be advertised for a `Layer` or collection of layers using `LayerStyle` objects.
 * If only a single style is available, that style is known as the "default" style and need not be advertised by the
 * server.
 */
export interface LayerStyle {
  /**
   * Machine-readable style name. Used in the GetMap request `layers` parameter as value of `style` property of
   * `LayerWithStyle` interface.
   */
  name: string;

  /**
   * Human-readable style title.
   */
  title: string;

  /**
   * Style narrative description.
   */
  description?: string;

  /**
   * Contains the locations of an images of a map legend appropriate to the particular `LayerStyle`.
   */
  legendUrls?: ImageResourceUrl[];

  /**
   * Provides symbology information for each style of a Layer.
   */
  stylesheetUrl?: StyleSheetUrl;

  /**
   * A Map Server may use `styleUrl` to offer more information about the data or symbology underlying a particular style.
   */
  styleUrl?: StyleUrl;
}
