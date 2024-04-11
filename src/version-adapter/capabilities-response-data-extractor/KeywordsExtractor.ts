import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { trim } from "../../utils/trim";
import type { Keyword } from "../../wms-data-types/get-capabilities-response/Keyword";

export class KeywordsExtractor
  implements SingleNodeDataExtractorFnFactory<Keyword[] | undefined>
{
  constructor(private readonly ns: string) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<Keyword[] | undefined> {
    return map()
      .toNodesArray(
        `${this.withNameSpace("KeywordList")}/${this.withNameSpace("Keyword")}`
      )
      .asArray()
      .ofObjects<Keyword>({
        value: map().toNode(".").mandatory().asString().withConversion(trim),
        vocabulary: map().toNode("@vocabulary").asString(),
      })
      .createNodeDataExtractor();
  }

  private withNameSpace(nodeName: string): string {
    return this.ns.length ? `${this.ns}:${nodeName}` : nodeName;
  }
}
