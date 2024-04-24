import type { ExceptionXmlChecker } from "../error";
import type { WmsXmlParser } from "./WmsXmlParser";

export class BaseWmsXmlParser implements WmsXmlParser {
  constructor(
    private readonly xmlParser: DOMParser,
    private readonly exceptionXmlChecker: ExceptionXmlChecker
  ) {}
  parse(xml: string): Document {
    const doc = this.xmlParser.parseFromString(xml, "text/xml");
    this.exceptionXmlChecker.check(doc);
    return doc;
  }
}
