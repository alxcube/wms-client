import xpath from "xpath";
import type { XmlResponseVersionExtractor } from "./XmlResponseVersionExtractor";

/**
 * Base XmlResponseVersionExtractor implementing class.
 */
export class BaseXmlResponseVersionExtractor
  implements XmlResponseVersionExtractor
{
  /**
   * @inheritdoc
   */
  extractVersion(doc: Document): string {
    const version = (xpath.select("string(/*/@version)", doc) as string).trim();
    if (!/^\d+(?:\.\d+(?:\.\d+)?)?$/.test(version)) {
      throw new TypeError(`No valid XML response version was found`);
    }
    return version;
  }
}
