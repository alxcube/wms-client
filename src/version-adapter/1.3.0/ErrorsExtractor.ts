import { map } from "@alxcube/xml-mapper";
import xpath from "xpath";
import { WmsException } from "../../error/WmsException";
import type { WmsErrorsExtractor } from "../BaseWmsVersionAdapter";

export class ErrorsExtractor implements WmsErrorsExtractor {
  extract(response: Document): WmsException[] {
    const mapErrors = map()
      .toNodesArray("//ogc:ServiceException")
      .mandatory()
      .asArray()
      .ofObjects({
        message: map().toNode(".").mandatory().asString(),
        code: map().toNode("@code").asString().withDefault(""),
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
