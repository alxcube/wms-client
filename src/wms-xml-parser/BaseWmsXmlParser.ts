import type { ExceptionXmlChecker } from "../error";
import type { WmsXmlParser } from "./WmsXmlParser";

/**
 * Base WmsXmlParser implementing class.
 */
export class BaseWmsXmlParser implements WmsXmlParser {
  /**
   * BaseWmsXmlParser constructor.
   *
   * @param xmlParser
   * @param exceptionXmlChecker
   */
  constructor(
    private readonly xmlParser: DOMParser,
    private readonly exceptionXmlChecker: ExceptionXmlChecker
  ) {}

  /**
   * @inheritdoc
   */
  parse(xml: string): Document {
    const doc = this.xmlParser.parseFromString(xml, "text/xml");
    this.exceptionXmlChecker.check(doc);
    return doc;
  }
}
