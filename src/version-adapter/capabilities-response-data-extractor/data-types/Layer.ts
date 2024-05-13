import type { Attribution } from "./Attribution";
import type { BoundingBox } from "./BoundingBox";
import type { Dimension } from "./Dimension";
import type { GeographicBoundingBox } from "./GeographicBoundingBox";
import type { Identifier } from "./Identifier";
import type { Keyword } from "./Keyword";
import type { LayerStyle } from "./LayerStyle";
import type { MetadataUrl } from "./MetadataUrl";
import type { ResourceUrl } from "./ResourceUrl";

type DataUrl = ResourceUrl;
type FeatureListUrl = ResourceUrl;

/**
 * Map layer metadata.
 */
export interface Layer {
  /**
   * Human-readable string for presentation in a menu.
   */
  title: string;

  /**
   * List of Coordinate Reference Systems, at which layer is available.
   */
  crs?: string[];

  /**
   * Machine-readable layer name.
   *
   * If, and only if, a layer has a `name`, then it is a map layer that can be requested by using that name in the
   * `layers` parameter of a GetMap request.
   *
   * If the layer has a `title` but no `name`, then that layer is only a category title for all the layers nested within.
   * A Client shall not attempt to request a layer that has a `title` but no `name`.
   *
   * A server shall throw a service exception (code="LayerNotDefined") if an invalid layer is requested.
   *
   * A containing category itself may include a `name` by which a map portraying all nested layers can be
   * requested at once. For example, a parent layer "Roads" may have children "Interstates" and "State Highways"
   * and allow the user to request either child individually or both together.
   */
  name?: string;

  /**
   * Narrative description of the map layer.
   */
  description?: string;

  /**
   * Keywords to aid in catalogue searches.
   */
  keywords?: Keyword[];

  /**
   * Minimum bounding rectangle in decimal degrees of the area covered by the Layer.
   */
  geographicBounds?: GeographicBoundingBox;

  /**
   * Array of the bounding rectangles of the map data in a particular coordinate reference systems.
   */
  boundingBoxes?: BoundingBox[];

  /**
   * Metadata for multi-dimensional data.
   */
  dimensions?: Dimension[];

  /**
   * Metadata of source of the geographic information used in a Layer.
   */
  attribution?: Attribution;

  /**
   * Layer identifiers.
   */
  identifiers?: Identifier[];

  /**
   * Layer metadata URLs.
   */
  metadataUrls?: MetadataUrl[];

  /**
   * A Map Server may use `DataURL` to offer a link to the underlying data represented by a particular layer.
   */
  dataUrls?: DataUrl[];

  /**
   * A Map Server may use a `FeatureListURL` object to point to a list of the features represented in a Layer.
   */
  featureListUrls?: FeatureListUrl[];

  /**
   * Array of styles, available for layer.
   */
  styles?: LayerStyle[];

  /**
   * Defines min scale for which it is appropriate to generate a map of a Layer.
   * Because maps from a Web Map Service may be viewed on arbitrary displays rather than on paper, the values used are
   * actually the scale denominators relative to a common display pixel size. The intent of scale denominators is not
   * the translation between “actual” and “standard” scales always be completely accurate. Rather, the intent is to
   * reduce the amount of clutter or crowding of features portrayed on the map. The scale denominator values are
   * guidelines for clients, not firm limits. Upon receiving a request for a map that is not within the scale denominator
   * range, the server may return a blank map, or may return a portrayal of the Layer that is crowded with features or
   * otherwise poorly suited for display; the server shall not respond with a service exception.
   * For the purposes of WMS Standard (v1.3.0), the common pixel size is defined to be 0.28mm × 0.28mm
   * (millimetres). Because arbitrary clients can request maps from a server, the true pixel size of the final
   * rendering device is unknown to the server.
   */
  minScaleDenominator?: number;

  /**
   * Defines max scale for which it is appropriate to generate a map of a Layer.
   * Because maps from a Web Map Service may be viewed on arbitrary displays rather than on paper, the values used are
   * actually the scale denominators relative to a common display pixel size. The intent of scale denominators is not
   * the translation between “actual” and “standard” scales always be completely accurate. Rather, the intent is to
   * reduce the amount of clutter or crowding of features portrayed on the map. The scale denominator values are
   * guidelines for clients, not firm limits. Upon receiving a request for a map that is not within the scale denominator
   * range, the server may return a blank map, or may return a portrayal of the Layer that is crowded with features or
   * otherwise poorly suited for display; the server shall not respond with a service exception.
   * For the purposes of WMS Standard (v1.3.0), the common pixel size is defined to be 0.28mm × 0.28mm
   * (millimetres). Because arbitrary clients can request maps from a server, the true pixel size of the final
   * rendering device is unknown to the server.
   */
  maxScaleDenominator?: number;

  /**
   * Layers may include a `scaleHing` property that suggests minimum and maximum scales for which it is appropriate to
   * display this layer. Because WMS output is destined for output devices of arbitrary size and resolution, the usual
   * definition of scale as the ratio of map size to real-world size is not appropriate here.
   * The following definition of `scaleHint` is recommended. Consider a hypothetical map with a given Bounding Box,
   * width and height. The central pixel of that map (or the pixel just to the northwest of center) will have some size,
   * which can be expressed as the ground distance in meters of the southwest to northeast diagonal of that pixel.
   * The two values in ScaleHint are the minimum and maximum recommended values of that diagonal. It is recognized that
   * this definition is not geodetically precise, but at the same time the hope is that by including it conventions will
   * develop that can be later specified more clearly.
   */
  scaleHint?: { min: number; max: number };

  /**
   * Indicates whether the server supports the "GetFeatureInfo" operation on that Layer. A server may support
   * "GetFeatureInfo" on some of its layers but not on all. A server shall issue a service exception
   * (code="LayerNotQueryable") if "GetFeatureInfo" is requested on a Layer that is not queryable.
   */
  queryable?: boolean;

  /**
   * A Layer is said to have been "cascaded" if it was obtained from an originating server and then included in the
   * service metadata of a different server. The second server may simply offer an additional access point for the
   * Layer, or may add value by offering additional output formats or reprojection to other coordinate reference
   * systems.
   *
   * If a WMS cascades the content of another WMS then it shall increment by 1 the value of the `cascaded` property for
   * the affected layers. If that attribute is missing from the originating server's service metadata, then
   * the Cascading WMS shall insert the attribute and set it to 1.
   */
  cascaded?: number;

  /**
   * If the optional Boolean property `opaque` is absent or false, then maps made from that Layer will generally
   * have significant no-data areas that a client may display as transparent. Vector features such as points and
   * lines are considered not to be opaque in this context (even though at some scales and symbol sizes a
   * collection of features might fill the map area). A true value for opaque indicates that the Layer represents an
   * area-filling coverage. For example, a map that represents topography and bathymetry as regions of differing
   * colours will have no transparent areas. The opaque declaration should be taken as a hint to the Client to
   * place such a Layer at the bottom of a stack of maps.
   * This property describes only the Layer’s data content, not the picture format of the map response. Whether or
   * not a Layer is listed as opaque, a server shall still consider the "GetMap" request `transparent` parameter:
   * that is, the server shall send an image with a transparent background if and only if the client requests
   * transparent=true and a picture format that supports transparency.
   */
  opaque?: boolean;

  /**
   * Indicates that the Server is not able to make a map of a geographic area other than the layer's bounding box.
   */
  noSubsets?: boolean;

  /**
   * When present and nonzero, indicate that the Server is not able to produce a map of the layer at a width different
   * from the fixed width indicated.
   */
  fixedWidth?: number;

  /**
   * When present and nonzero, indicate that the Server is not able to produce a map of the layer at a height different
   * from the fixed height indicated.
   */
  fixedHeight?: number;

  /**
   * Children layers.
   */
  layers?: Layer[];
}
