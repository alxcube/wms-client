import type {
  MapRequestParams,
  MapRequestParamsWithCustom,
} from "../../client";
import type { ExceptionFormat } from "../../error";
import type { VersionComparator } from "../../version-comparator";

import type { MapRequestParamsTransformer } from "./MapRequestParamsTransformer";

/**
 * Generic implementation of MapRequestParamsTransformer.
 */
export class GenericMapRequestParamsTransformer
  implements MapRequestParamsTransformer
{
  /**
   * GenericMapRequestParamsTransformer constructor.
   *
   * @param versionComparator
   * @param version
   */
  constructor(
    private readonly versionComparator: VersionComparator,
    private readonly version: string
  ) {}

  /**
   * @inheritdoc
   */
  transform(params: MapRequestParamsWithCustom): object {
    const requestParams: { [key: string]: unknown } = {};

    Object.keys(params).forEach((key: keyof MapRequestParamsWithCustom) => {
      switch (key) {
        case "layers":
          requestParams.layers = this.getLayersParam(params[key]);
          requestParams.styles = this.getStylesParam(params[key]);
          break;
        case "bounds":
          requestParams.bbox = this.getBboxParam(params[key]);
          break;
        case "transparent":
          requestParams.transparent = params[key] ? "TRUE" : "FALSE";
          break;
        case "crs":
          requestParams[this.getCrsParamName()] = params[key];
          break;
        case "exceptionsFormat":
          requestParams["exceptions"] = this.transformExceptionFormat(
            params[key]
          );
          break;
        case "bgColor":
          requestParams.bgcolor = params[key];
          break;
        default:
          requestParams[key] = params[key];
          break;
      }
    });

    requestParams[this.getVersionParamName()] = this.version;
    requestParams.service = "WMS";
    requestParams.request = this.getRequestName();

    return requestParams;
  }

  /**
   * Transforms `bounds` property of `MapRequestParams` interface to string value of `bbox` param of "GetMap" request.
   *
   * @param bounds
   * @private
   */
  private getBboxParam(bounds: MapRequestParams["bounds"]): string {
    return [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY].join(",");
  }

  /**
   * Transforms `layers` property of `MapRequestParams` interface to string value of `layers` param of "GetMap" request.
   *
   * @param layers
   * @private
   */
  private getLayersParam(layers: MapRequestParams["layers"]): string {
    return layers.map(({ layer }) => layer).join(",");
  }

  /**
   * Transforms `layers` property of `MapRequestParams` interface to string value of `styles` param of "GetMap" request.
   *
   * @param layers
   * @private
   */
  private getStylesParam(layers: MapRequestParams["layers"]): string {
    return layers.map(({ style }) => style || "").join(",");
  }

  /**
   * Returns true, if working with WMS version 1.0.
   * @private
   */
  private isV1_0_x(): boolean {
    return this.versionComparator.is(this.version, "<", "1.1");
  }

  /**
   * Returns true, if working with WMS version 1.3.
   * @private
   */
  private isV1_3_x(): boolean {
    return this.versionComparator.is(this.version, ">=", "1.3");
  }

  /**
   * Returns true, if working with WMS version 1.1.
   * @private
   */
  private isV1_1(): boolean {
    return (
      this.versionComparator.is(this.version, ">=", "1.1") &&
      this.versionComparator.is(this.version, "<", "1.2")
    );
  }

  /**
   * Returns param name for WMS version param of "GetMap" request.
   * @private
   */
  private getVersionParamName(): string {
    return this.isV1_0_x() ? "wmtver" : "version";
  }

  /**
   * Returns `request` param value of "GetMap" request.
   * @private
   */
  private getRequestName(): string {
    return this.isV1_0_x() ? "map" : "GetMap";
  }

  /**
   * Returns param name for Coordinate (Spatial) Reference System param of "GetMap" request.
   * @private
   */
  private getCrsParamName(): string {
    return this.isV1_3_x() ? "crs" : "srs";
  }

  /**
   * Transforms unified `ExceptionFormat` constant value to a value, understandable by particular WMS version.
   *
   * @param exceptionFormat
   * @private
   */
  private transformExceptionFormat(
    exceptionFormat: ExceptionFormat | string | undefined
  ): string | undefined {
    if (this.isV1_1()) {
      switch (exceptionFormat) {
        case "XML":
          return "application/vnd.ogc.se_xml";
        case "INIMAGE":
          return "application/vnd.ogc.se_inimage";
        case "BLANK":
          return "application/vnd.ogc.se_blank";
        default:
          return exceptionFormat;
      }
    }
    if (this.isV1_0_x() && exceptionFormat === "XML") {
      return "WMS_XML";
    }
    return exceptionFormat;
  }
}
