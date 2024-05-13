import type { ExceptionFormat } from "../../../error";
import type { ContactInformation } from "./ContactInformation";
import type { Keyword } from "./Keyword";
import type { Layer } from "./Layer";
import type { OperationType } from "./OperationType";

/**
 * Unified response interface of "GetCapabilities" request.
 */
export interface UnifiedCapabilitiesResponse {
  /**
   * WMS version.
   */
  version: string;

  /**
   * The optional `updateSequence` property is for maintaining cache consistency. Its value can be string that represents
   * a timestamp in ISO 8601:2000 format, or any other string.
   * The server may include an `updateSequence` value in its service metadata. If present, this value should be
   * increased when changes are made to the Capabilities (e.g., when new maps are added to the service). The
   * client may include this parameter in its "GetCapabilities" request.
   */
  updateSequence?: string;

  /**
   * General service metadata.
   */
  service: {
    /**
     * Brief service title.
     */
    title: string;

    /**
     * Service url. May be used to refer to the web-site of the service provider.
     */
    url: string;

    /**
     * Narrative service description.
     */
    description?: string;

    /**
     * A list of keywords or keyword phrases describing the server as a whole should be included to help catalog
     * searching.
     */
    keywords?: Keyword[];

    /**
     * Contact information.
     */
    contactInformation?: ContactInformation;

    /**
     * The optional property `fees` may be omitted if they do not apply to the server. If property is present, the
     * reserved word "none" (case-insensitive) shall be used if there are no fees.
     * When constraints are imposed, no precise syntax has been defined for the text content of this property, but
     * client applications may display the content for user information and action.
     */
    fees?: string;

    /**
     * The optional property `accessConstraints` may be omitted if they do not apply to the server. If property is present, the
     * reserved word "none" (case-insensitive) shall be used if there are no access constraints.
     * When constraints are imposed, no precise syntax has been defined for the text content of this property, but
     * client applications may display the content for user information and action.
     */
    accessConstraints?: string;

    /**
     * Indicates the maximum number of layers a client is permitted to include in a single "GetMap" request. If this
     * property is absent the server imposes no limit.
     */
    layerLimit?: number;

    /**
     * Indicates the maximum width value that a client is permitted to include in a single "GetMap" request. If property
     * is absent the server imposes no limit on width.
     */
    maxWidth?: number;

    /**
     * Indicates the maximum height value that a client is permitted to include in a single "GetMap" request. If property
     * is absent the server imposes no limit on height.
     */
    maxHeight?: number;
  };

  /**
   * A Capability lists available request types, how exceptions may be reported, and list of map layers available from
   * this server.
   */
  capability: {
    /**
     * Request types of particular WMS server.
     */
    request: {
      /**
       * "GetCapabilities" request details.
       */
      getCapabilities: OperationType;

      /**
       * "GetMap" request details.
       */
      getMap: OperationType;

      /**
       * "GetFeatureInfo" request details.
       */
      getFeatureInfo?: OperationType;

      /**
       * "DescribeLayer" request details.
       */
      describeLayer?: OperationType;
    };

    /**
     * Exception formats, supported by particular server.
     */
    exceptionFormats: ExceptionFormat[];

    /**
     * Available map layers.
     */
    layers: Layer[];
  };
}
