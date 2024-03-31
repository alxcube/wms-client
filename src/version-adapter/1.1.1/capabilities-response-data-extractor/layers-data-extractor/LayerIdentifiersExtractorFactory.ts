import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Identifier } from "../../../../wms-data-types/Identifier";

export class LayerIdentifiersExtractorFactory
  implements SingleNodeDataExtractorFnFactory<Identifier[] | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    Identifier[] | undefined
  > {
    return map()
      .toNodesArray("Identifier")
      .asArray()
      .ofObjects({
        authority: map().toNode("@authority").mandatory().asString(),
        value: map().toNode(".").mandatory().asString(),
      })
      .createNodeDataExtractor();
  }
}
