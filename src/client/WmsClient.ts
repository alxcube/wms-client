import type { AxiosInstance } from "axios";
import type { ExceptionFormat } from "../error";
import type {
  RequestBoundingBox,
  UnifiedCapabilitiesResponse,
} from "../version-adapter";

/**
 * WmsClient options.
 */
export interface WmsClientOptions {
  /**
   * Custom query string params. Will be added to every request to GetCapabilities, GetMap and GetFeatureInfo methods.
   */
  query?: { [key: string]: unknown };

  /**
   * Custom GetMap request base url. If not set, the WMS base url will be used. This option may be set in negotiation
   * process.
   */
  mapRequestUrl?: string;

  /**
   * Custom GetFeatureInfo request base url. If not set, the WMS base url will be used. This option may be set in
   * negotiation process.
   */
  featureInfoRequestUrl?: string;
}

/**
 * Query params of WMS GetCapabilities request.
 */
export interface CapabilitiesRequestParams {
  /**
   * The optional `updateSequence` parameter is for maintaining cache consistency. Its value can be either an
   * integer, or a string that represents a timestamp in ISO 8601:2000 format, or any other string.
   * The server may include an UpdateSequence value in its service metadata. If present, this value should be
   * increased when changes are made to the Capabilities (e.g., when new maps are added to the service). The
   * client may include this parameter in its GetCapabilities request. The response of the server based on the
   * presence and relative value of UpdateSequence in the client request and the server metadata shall be
   * according to the following table:
   * | Client Request UpdateSequence Value | Server Metadata UpdateSequence Value | Server Response                       |
   * |-------------------------------------|--------------------------------------|---------------------------------------|
   * | none                                | any                                  | most recent service metadata          |
   * | any                                 | none                                 | most recent service metadata          |
   * | equal                               | equal                                | Exception: code=CurrentUpdateSequence |
   * | lower                               | higher                               | most recent service metadata          |
   * | higher                              | lower                                | Exception: code=InvalidUpdateSequence |
   */
  updateSequence?: number | string;

  /**
   * Custom parameters.
   */
  [key: string]: number | string | undefined;
}

/**
 * Query param of layer name and optional corresponding layer style name.
 */
export interface LayerWithStyle {
  /**
   * Allowed layer names are the content of any `Layer.name` element in the service metadata.
   */
  layer: string;

  /**
   * The style in which layer is to be rendered. The value of the `style` parameter is a valid style name.
   *
   * Style Name shall be one that was defined in a Layer.styles[*].name element in service metadata. (In other words,
   * the Client may not request a Layer in a Style that was only defined for a different Layer.) A server shall throw a
   * service exception (code = StyleNotDefined) if an unadvertised Style is requested. A client may request the
   * default Style omitting `style` property.
   *
   * If the server advertises several styles for a layer, and the client sends a request for the default style, the
   * choice of which style to use as default is at the discretion of the server. The ordering of styles in the service
   * metadata does not indicate which is the default.
   */
  style?: string;
}

/**
 * Query params of WMS GetMap request.
 */
export interface MapRequestParams {
  /**
   * The mandatory `layers` parameter lists the map layer(s) to be returned by this GetMap request.
   * A WMS shall render the requested layers by drawing the leftmost in the list bottommost, the next one over that,
   * and so on.
   * The optional `layerLimit` element in the `UnifiedCapabilitiesResponse.service.layerLimit` is a positive integer
   * indicating the maximum number of layers a client is permitted to include in a single GetMap request.
   * If this element is absent the server imposes no limit.
   */
  layers: LayerWithStyle[];

  /**
   * The `crs` request parameter states what Layer CRS applies to the `bounds` request parameter. The
   * value of the `crs` parameter in a request to a particular server shall be one of the values defined in that
   * server's service metadata in a `Layer.crs` array. The same CRS applies to all layers in a single request.
   * A WMS server is not required to support all possible CRSs, but it shall advertise in its service metadata those
   * CRSs which it does offer and shall accept requests for all advertised CRSs. If a request contains a CRS not
   * offered by a particular server, the server shall throw a service exception (code = "InvalidCRS").
   * Clients are not required to support all possible CRSs. If a Client and Service do not support any mutually
   * agreeable CRSs, the Client may, at its discretion, cease communicating with that service, or search for an
   * intermediary service provider that performs coordinate transformations, or allow the user to choose other
   * disposition methods.
   */
  crs: string;

  /**
   * The mandatory `bounds` parameter allows a Client to request a particular Bounding Box.
   * The four bounding box values indicate the outside limits of the region. The relation of the Bounding Box to the map
   * pixel matrix is that the bounding box goes around the "outside" of the pixels of the map rather than through the
   * centers of the map's border pixels. In this context, individual pixels represent an area on the ground.
   * If a request contains an invalid BoundingBox (e.g., one whose minimum X is greater than or equal to the maximum X,
   * or whose minimum Y is greater than or equal to the maximum Y) the server shall throw a service exception.
   * If a request contains a `bounds` whose area does not overlap at all with the `Layer.boundingBoxes` element in the
   * service metadata for the requested layer, the server shall return empty content (that is, a blank map or an
   * graphic element file with no elements) for that map. Any features that are partly or entirely contained in the
   * Bounding Box shall be returned in the appropriate format.
   * If the Bounding Box values are not defined for the given CRS (e.g., latitudes greater than 90 degrees in
   * CRS:84), the server should return empty content for areas outside the valid range of the CRS.
   * If the WMS server has declared that a Layer is not subsettable, then the Client shall
   * specify exactly the declared Bounding Box values in the GetMap request and the Server may issue a service
   * exception otherwise.
   */
  bounds: RequestBoundingBox;

  /**
   * The mandatory `width` parameter specify the width in integer pixels of the map to be produced.
   * The Map CS applies to the map. WIDTH-1 specifies the maximum value of the `x` axis in the Map CS.
   * If the request is for a picture format, the returned picture, regardless of its MIME type, shall have exactly the
   * specified width and height in pixels. In the case where the aspect ratio of the BBOX and the ratio width/height
   * are different, the WMS shall stretch the returned map so that the resulting pixels could themselves be
   * rendered in the aspect ratio of the BBOX. In other words, it shall be possible using this definition to request a
   * map for a device whose output pixels are themselves non-square, or to stretch a map into an image area of a
   * different aspect ratio.
   * Map distortions will be introduced if the aspect ratio WIDTH/HEIGHT is not commensurate with X, Y and the
   * pixel aspect. Client developers should minimize the possibility that users will inadvertently request or
   * unknowingly receive distorted maps.
   * If a request is for a graphic element format that does not have explicit width and height, the client shall include
   * the WIDTH and HEIGHT values in the request and a server may use them as helpful information in
   * constructing the output map.
   * The optional `maxWidth` property in the service metadata is integer indicating the
   * maximum width value that a client is permitted to include in a single GetMap request. If either
   * property is absent the server imposes no limit on the corresponding parameter.
   * If the WMS server has declared that a Layer has fixed width, then the
   * Client shall specify exactly those `width` value in the GetMap request and the Server may
   * issue a service exception otherwise.
   */
  width: number;

  /**
   * The mandatory `height` parameter specify the height in integer pixels of the map to be produced.
   * The Map CS applies to the map. HEIGHT-1 specifies the maximum value of the `y` axis in the Map CS.
   * If the request is for a picture format, the returned picture, regardless of its MIME type, shall have exactly the
   * specified width and height in pixels. In the case where the aspect ratio of the BBOX and the ratio width/height
   * are different, the WMS shall stretch the returned map so that the resulting pixels could themselves be
   * rendered in the aspect ratio of the BBOX. In other words, it shall be possible using this definition to request a
   * map for a device whose output pixels are themselves non-square, or to stretch a map into an image area of a
   * different aspect ratio.
   * Map distortions will be introduced if the aspect ratio WIDTH/HEIGHT is not commensurate with X, Y and the
   * pixel aspect. Client developers should minimize the possibility that users will inadvertently request or
   * unknowingly receive distorted maps.
   * If a request is for a graphic element format that does not have explicit width and height, the client shall include
   * the WIDTH and HEIGHT values in the request and a server may use them as helpful information in
   * constructing the output map.
   * The optional `maxHeight` property in the service metadata is integer indicating the
   * maximum height value that a client is permitted to include in a single GetMap request. If either
   * property is absent the server imposes no limit on the corresponding parameter.
   * If the WMS server has declared that a Layer has fixed height, then the
   * Client shall specify exactly those `height` value in the GetMap request and the Server may
   * issue a service exception otherwise.
   */
  height: number;

  /**
   * The mandatory FORMAT parameter states the desired format of the map. Supported values for a GetMap
   * request on a WMS server are listed in one or more
   * `UnifiedCapabilitiesResponse.capability.request.getMap.responseFormats` props of its service metadata.
   * There is no default format. If the request specifies a format not supported by the server, the server shall
   * issue a service exception (code = InvalidFormat).
   */
  format: string;

  /**
   * The optional `transparent` parameter specifies whether the map background is to be made transparent or
   * not. The default value is `false` if this parameter is absent from the request.
   * The ability to return pictures drawn with transparent pixels allows results of different Map requests to be
   * overlaid, producing a composite map. It is strongly recommended that every WMS offer a format that
   * provides transparency for layers that could sensibly be overlaid above others.
   * When `transparent` is set to `true` and the `format` parameter contains a Picture format (e.g., image/gif),
   * then a WMS shall return (when permitted by the requested format) a result where all of the pixels not
   * representing features or data values in that Layer are set to a transparent value. For example, a "roads" layer
   * would be transparent wherever no road is shown. If the picture format does not support transparency, then
   * the server shall respond with a non-transparent image (in other words, it is not an error for the client to always
   * request transparent maps regardless of format). When `transparent` is set to FALSE, non-data pixels shall
   * be set to the value of `bgColor`.
   * When the Layer has been declared "opaque", then significant portions, or the entirety, of the
   * map may not be able to made transparent. Clients may still request transparent=true
   * When the `format` parameter contains a Graphic Element format, the `transparent` parameter may be
   * included in the request but its value shall be ignored by the WMS.
   */
  transparent?: boolean;

  /**
   * The optional `bgColor` parameter is a string that specifies the color to be used as the background (non-data)
   * pixels of the map. The general format of `bgColor` is a hexadecimal encoding of an RGB value where two
   * hexadecimal characters are used for each of Red, Green, and Blue colour values. The values can range
   * between 00 and FF for each (0 and 255, base 10). The format is 0xRRGGBB; either upper or lower case
   * characters are allowed for RR, GG, and BB values. The "0x" prefix shall have a lower case ‘x’. The default
   * value is 0xFFFFFF (corresponding to the colour white) if this parameter is absent from the request.
   * When `format` is a picture format, a WMS shall set the background pixels to the colour specified by
   * `bgColor`. When `format` is a graphic element format (which does not have an explicit background), or a
   * picture format, a WMS should avoid use of the `bgColor` value for foreground elements because they would
   * not be visible against a background picture of the same colour.
   * When the Layer has been declared as "opaque" (or is an area-filling coverage despite the
   * absence of an "opaque" declaration), then significant portions, or the entirety, of the map may not show any
   * background at all.
   */
  bgColor?: string;

  /**
   * Sets exceptions format.
   * The default value is "XML" if this parameter is absent from the request.
   * Exception formats, supported by given WMS server can be found in
   * `UnifiedCapabilitiesResponse.capability.exceptionFormats` array. A server may issue a service exception in the
   * default XML format if a request specifies a different exception format not supported by the server.
   *
   * The following formats are supported:
   *
   * * "XML" - Errors are reported using service exception XML, and will be intercepted, converted and thrown as
   *   `WmsExceptionReport` (when multiple exception entries found in response XML) or `WmsException`, (when single
   *   exception entry is found in response XML).
   *
   * * "INIMAGE" - If the `exceptionsFormat` parameter is set to "INIMAGE", the WMS shall, upon detecting an error,
   *   return an object of the MIME type specified in the `format` parameter whose content includes text describing the
   *   nature of the error. In the case of a picture format, the error message shall be drawn on the returned picture.
   *   In the case of a graphic element format, the text of the error message shall be rendered in the manner that text
   *   is normally represented in that format.
   *
   * * "BLANK" - If the `exceptionsFormat` parameter is set to "BLANK", the WMS shall, upon detecting an error, return
   *   an object of the type specified in `format` whose content is uniformly "off". In the case of a picture format,
   *   that response shall be an image containing only pixels of one colour (the background colour). In the case of a
   *   picture format supporting transparency, if `transparent` == true is specified the pixels shall all be transparent.
   *   In the case of a graphic element output format, no visible graphic elements shall be included in the response
   *   output.
   */
  exceptionsFormat?: ExceptionFormat | string;

  /**
   * Time value, according to WMS specification.
   */
  time?: number | string;

  /**
   * Elevation value, according to WMS specification.
   */
  elevation?: number | string;
}

/**
 * Query params of GetMap WMS request with custom params.
 */
export interface MapRequestParamsWithCustom extends MapRequestParams {
  [key: string]: unknown;
}

/**
 * Query params of GetFeatureInfo WMS request.
 */
export interface FeatureInfoRequestParams extends MapRequestParams {
  /**
   * The mandatory `queryLayers` parameter states the map layer(s) from which feature information is desired
   * to be retrieved. This parameter shall contain at least one layer name, but may contain fewer layers than the
   * original GetMap request.
   * If any layer in the `queryLayers` parameter is not defined in the service metadata of the WMS, the server
   * shall issue a service exception (code = LayerNotDefined).
   */
  queryLayers: string[];

  /**
   * The mandatory `infoFormat` parameter indicates what format to use when returning the feature
   * information. Supported values for a GetFeatureInfo request on a WMS server are listed as MIME types in one
   * or more `UnifiedCapabilitiesResponse.capability.request.GetFeatureInfo.responseFormats` string.
   * If the request specifies a format not supported by the server, the server shall issue a service
   * exception (code = InvalidFormat).
   */
  infoFormat: string;

  /**
   * The mandatory `x` and `y` request parameters are integers that indicate a point of interest on the map that was
   * produced by the embedded GetMap request. The point (`x`,`y`) is a
   * point in the (x,y) space defined by the Map CS. Therefore:
   * * the value of `x` shall be between 0 and the maximum value of the x-axis;
   * * the value of `y` shall be between 0 and the maximum value of the y-axis;
   * * the point `x`=0, `y`=0 indicates the pixel at the upper-left corner of the map;
   * * `x` increases to the right and `y` increases downward.
   * The point (`x`,`y`) represents the center of the indicated pixel.
   * If the value of `x` or of `y` is invalid, the server shall issue a service exception (code = InvalidPoint).
   */
  x: number;

  /**
   * The mandatory `x` and `y` request parameters are integers that indicate a point of interest on the map that was
   * produced by the embedded GetMap request. The point (`x`,`y`) is a
   * point in the (x,y) space defined by the Map CS. Therefore:
   * * the value of `x` shall be between 0 and the maximum value of the x-axis;
   * * the value of `y` shall be between 0 and the maximum value of the y-axis;
   * * the point `x`=0, `y`=0 indicates the pixel at the upper-left corner of the map;
   * * `x` increases to the right and `y` increases downward.
   * The point (`x`,`y`) represents the center of the indicated pixel.
   * If the value of `x` or of `y` is invalid, the server shall issue a service exception (code = InvalidPoint).
   */
  y: number;

  /**
   * The optional `featureCount` parameter states the maximum number of features per layer for which
   * feature information shall be returned. Its value is a positive integer. The default value is 1 if this parameter is
   * omitted.
   */
  featureCount?: number;
}

/**
 * Query params of GetFeatureInfo WMS request with custom params.
 */
export interface FeatureInfoRequestParamsWithCustom
  extends FeatureInfoRequestParams {
  [key: string]: unknown;
}

/**
 * Web Map Service Client.
 */
export interface WmsClient {
  /**
   * Returns client WMS version.
   */
  getVersion(): string;

  /**
   * Returns WMS base url.
   */
  getWmsUrl(): string;

  /**
   * Returns promise of `UnifiedCapabilitiesResponse` with WMS metadata.
   *
   * @param params
   */
  getCapabilities(
    params?: CapabilitiesRequestParams
  ): Promise<UnifiedCapabilitiesResponse>;

  /**
   * Returns promise of `ArrayBuffer` of WMS server response body. This array buffer may be converted to image or
   * text (for text response formats). It also should intercept exception responses in XML format and reject with
   * `WmsExceptionReport` when response contains multiple exception report entries or `WmsException` when response
   * contains single exception entry.
   *
   * @param params
   */
  getMap(params: MapRequestParamsWithCustom): Promise<ArrayBuffer>;

  /**
   * Returns GetMap request base url. This is equal to WMS base url, unless it was altered with `setMapRequestUrl()`
   * method or `mapRequestUrl` option. The latter may be set in negotiation process in `WmsNegotiator`.
   */
  getMapRequestUrl(): string;

  /**
   * Sets GetMap request base url.
   *
   * @param url
   */
  setMapRequestUrl(url: string): void;

  /**
   * Returns full GetMap request url. This can be used e.g. for setting `HTMLImageElement.src` property for direct image
   * display in browser.
   * The url will also contain custom params, passed via `query` option of `WmsClientOptions`.
   *
   * @param params
   */
  getMapUrl(params: MapRequestParamsWithCustom): string;

  /**
   * Returns custom query string params, which are applied to each request.
   */
  getCustomQueryParams(): { [key: string]: unknown };

  /**
   * Returns Axios instance, used by WMS client instance.
   */
  getHttpClient(): AxiosInstance;

  /**
   * Returns promise of GetFeatureInfo response body as string. If client responds with exception XML, the returned
   * promise will be rejected with `WmsExceptionReport` when response contains multiple exception entries, or with
   * `WmsException`, when response contains single exception entry.
   *
   * @param params
   */
  getFeatureInfo(params: FeatureInfoRequestParamsWithCustom): Promise<string>;

  /**
   * Returns GetFeatureInfo request base url. This is equal to WMS base url, unless it was altered with
   * `setFeatureInfoRequestUrl()` method or `featureInfoRequestUrl` option. The latter may be set in negotiation
   * process in `WmsNegotiator`.
   */
  getFeatureInfoRequestUrl(): string;

  /**
   * Sets GetFeatureInfo request base url.
   *
   * @param url
   */
  setFeatureInfoRequestUrl(url: string): void;
}
