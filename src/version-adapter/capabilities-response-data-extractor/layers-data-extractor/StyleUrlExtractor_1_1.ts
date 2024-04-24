import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { ResourceUrl } from "../data-types";

export class StyleUrlExtractor_1_1
  implements SingleNodeDataExtractorFnFactory<ResourceUrl | undefined>
{
  constructor(private readonly ns: string) {}

  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    ResourceUrl | undefined
  > {
    return map()
      .toNode(withNamespace("StyleURL", this.ns))
      .asObject({
        format: map()
          .toNode(withNamespace("Format", this.ns))
          .mandatory()
          .asString(),
        url: map()
          .toNode(`${withNamespace("OnlineResource", this.ns)}/@xlink:href`)
          .mandatory()
          .asString(),
      })
      .createNodeDataExtractor();
  }
}
