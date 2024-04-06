import xpath from "xpath";
import type { XmlResponseVersionExtractor } from "./XmlResponseVersionExtractor";

export class BaseXmlResponseVersionExtractor
  implements XmlResponseVersionExtractor
{
  extractVersion(doc: Document): string {
    const version = (xpath.select("string(/*/@version)", doc) as string).trim();
    if (!/^\d+(?:\.\d+(?:\.\d+)?)?$/.test(version)) {
      throw new TypeError(`No valid XML response version was found`);
    }
    return version;
  }
}
