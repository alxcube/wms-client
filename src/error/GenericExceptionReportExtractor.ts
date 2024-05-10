import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import xpath from "xpath";
import { trim, withNamespace } from "../utils";
import type { VersionComparator } from "../version-comparator";
import type { XmlResponseVersionExtractor } from "../version-adapter";
import type {
  ExceptionReportEntry,
  ExceptionReportExtractor,
} from "./ExceptionReportExtractor";
import { WmsExceptionCode } from "./WmsExceptionCode";

/**
 * Generic ExceptionReportExtractor, compatible with WMS v1.1.1, v1.3.0
 */
export class GenericExceptionReportExtractor
  implements ExceptionReportExtractor
{
  /**
   * GenericExceptionReportExtractor constructor.
   *
   * @param versionExtractor
   * @param versionComparator
   * @param fromVersion
   * @param toVersion
   * @param ns
   */
  constructor(
    private readonly versionExtractor: XmlResponseVersionExtractor,
    private readonly versionComparator: VersionComparator,
    private readonly fromVersion: string,
    private readonly toVersion: string,
    private readonly ns: string
  ) {}

  /**
   * @inheritdoc
   */
  extractExceptionReport(doc: Document): ExceptionReportEntry[] | undefined {
    let version;
    try {
      version = this.versionExtractor.extractVersion(doc);
    } catch (e) {
      return undefined;
    }

    if (
      this.versionComparator.is(version, ">=", this.fromVersion) &&
      this.versionComparator.is(version, "<", this.toVersion)
    ) {
      const select = xpath.useNamespaces({ ogc: "http://www.opengis.net/ogc" });
      return this.getDataExtractor()(doc, select);
    }
  }

  /**
   * Creates XML data extractor for ExceptionReportEntry objects array.
   * @private
   */
  private getDataExtractor(): SingleNodeDataExtractorFn<
    ExceptionReportEntry[] | undefined
  > {
    return map()
      .toNodesArray(`//${withNamespace("ServiceException", this.ns)}`)
      .mandatory()
      .asArray()
      .ofObjects({
        message: map().toNode(".").mandatory().asString().withConversion(trim),
        code: map()
          .toNode("@code")
          .asString()
          .withConversion(
            (code) =>
              (code === "InvalidSRS"
                ? WmsExceptionCode.InvalidCRS
                : code) as WmsExceptionCode
          ),
        locator: map().toNode("@locator").asString(),
      })
      .createNodeDataExtractor();
  }
}
