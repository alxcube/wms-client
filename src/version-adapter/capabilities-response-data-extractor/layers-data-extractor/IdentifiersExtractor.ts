import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { XPathSelect } from "xpath";
import { withNamespace } from "../../../utils";
import type { Identifier } from "../data-types";

/**
 * `Identifier` objects array extractor.
 */
export class IdentifiersExtractor
  implements SingleNodeDataExtractorFnFactory<Identifier[] | undefined>
{
  /**
   * IdentifiersExtractor constructor.
   *
   * @param ns
   */
  constructor(private readonly ns: string) {}

  /**
   * @inheritdoc
   */
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    Identifier[] | undefined
  > {
    return map()
      .toNodesArray(withNamespace("Identifier", this.ns))
      .asArray()
      .ofObjects({
        value: map().toNode(".").mandatory().asString(),
        authorityUrl: (node, select) => this.getAuthorityUrl(node, select),
      })
      .createNodeDataExtractor();
  }

  /**
   * Returns corresponding authority URL for given <Identifier/> node.
   *
   * @param identifierNode
   * @param select
   * @private
   */
  private getAuthorityUrl(identifierNode: Node, select: XPathSelect): string {
    const authority = select("string(@authority)", identifierNode) as string;
    const lookupExpression =
      `//${withNamespace("Layer", this.ns)}` +
      `//${withNamespace("AuthorityURL", this.ns)}[@name="${authority.trim()}"][1]` +
      `/${withNamespace("OnlineResource", this.ns)}/@xlink:href`;
    return select(`string(${lookupExpression})`, identifierNode) as string;
  }
}
