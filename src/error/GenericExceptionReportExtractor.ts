import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import xpath from "xpath";
import { trim } from "../utils/trim";
import { withNamespace } from "../utils/withNamespace";
import type { VersionComparator } from "../version-comparator/VersionComparator";
import type { XmlResponseVersionExtractor } from "../XmlResponseVersionExtractor";
import type {
  ExceptionReportEntry,
  ExceptionReportExtractor,
} from "./ExceptionReportExtractor";
import { WmsExceptionCode } from "./WmsExceptionCode";

export class GenericExceptionReportExtractor
  implements ExceptionReportExtractor
{
  constructor(
    private readonly versionExtractor: XmlResponseVersionExtractor,
    private readonly versionComparator: VersionComparator,
    private readonly fromVersion: string,
    private readonly toVersion: string,
    private readonly ns: string
  ) {}
  extractExceptionReport(doc: Document): ExceptionReportEntry[] | undefined {
    const version = this.versionExtractor.extractVersion(doc);
    if (
      this.versionComparator.is(version, ">=", this.fromVersion) &&
      this.versionComparator.is(version, "<", this.toVersion)
    ) {
      const select = xpath.useNamespaces({ ogc: "http://www.opengis.net/ogc" });
      return this.getDataExtractor()(doc, select);
    }
  }

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
