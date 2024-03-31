import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { trim } from "../../../utils/trim";
import type { Keyword } from "../../../wms-data-types/Keyword";

export class KeywordsExtractorFactory
  implements SingleNodeDataExtractorFnFactory<Keyword[] | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<Keyword[] | undefined> {
    return map()
      .toNodesArray("KeywordList/Keyword")
      .asArray()
      .ofObjects<Keyword>({
        value: map().toNode(".").mandatory().asString().withConversion(trim),
        vocabulary: map().toNode("@vocabulary").asString(),
      })
      .createNodeDataExtractor();
  }
}
