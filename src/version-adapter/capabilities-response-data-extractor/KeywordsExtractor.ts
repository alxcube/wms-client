import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { trim } from "../../utils";
import type { Keyword } from "./data-types";

/**
 * `Keyword` objects array extractor, compatible with WMS 1.1, 1.3.
 */
export class KeywordsExtractor
  implements SingleNodeDataExtractorFnFactory<Keyword[] | undefined>
{
  /**
   * KeywordsExtractor constructor.
   *
   * @param ns
   */
  constructor(private readonly ns: string) {}

  /**
   * @inheritdoc
   */
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
