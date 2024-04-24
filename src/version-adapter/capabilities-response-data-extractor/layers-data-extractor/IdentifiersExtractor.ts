import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { Identifier } from "../data-types";

export class IdentifiersExtractor
  implements SingleNodeDataExtractorFnFactory<Identifier[] | undefined>
{
  constructor(private readonly ns: string) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    Identifier[] | undefined
  > {
    return map()
      .toNodesArray(withNamespace("Identifier", this.ns))
      .asArray()
      .ofObjects({
        authority: map().toNode("@authority").mandatory().asString(),
        value: map().toNode(".").mandatory().asString(),
      })
      .createNodeDataExtractor();
  }
}
