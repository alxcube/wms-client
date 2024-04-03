import { map } from "@alxcube/xml-mapper";
import xpath from "xpath";
import { WmsException } from "../../error/WmsException";
import { WmsExceptionCode } from "../../error/WmsExceptionCode";
import { trim } from "../../utils/trim";
import { withNamespace } from "../../utils/withNamespace";
import type { WmsErrorsExtractor } from "../BaseWmsVersionAdapter";

export class ErrorsExtractor implements WmsErrorsExtractor {
  constructor(private readonly ns: string) {}
  extract(response: Document): WmsException[] {
    const mapErrors = map()
      .toNodesArray(`//${withNamespace("ServiceException", this.ns)}`)
      .mandatory()
      .asArray()
      .ofObjects({
        message: map().toNode(".").mandatory().asString().withConversion(trim),
        code: map()
          .toNode("@code")
          .asString()
          .withConversion((code) =>
            code === "InvalidSRS" ? WmsExceptionCode.InvalidCRS : code
          )
          .withDefault(""),
        locator: map().toNode("@locator").asString(),
      })
      .createNodeDataExtractor();

    const select = xpath.useNamespaces({ ogc: "http://www.opengis.net/ogc" });

    const errors = mapErrors(response, select);

    return errors.map((err) => {
      return new WmsException(err.message, err.code, err.locator);
    });
  }
}
