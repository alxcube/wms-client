import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { Keyword, Layer } from "../data-types";
import type { XmlDataExtractor } from "../XmlDataExtractor";

/**
 * Generic `Layer` objects array extractor.
 */
export class LayersExtractor
  implements SingleNodeDataExtractorFnFactory<Layer[]>
{
  /**
   * LayersExtractor constructor.
   *
   * @param keywordsExtractor
   * @param crsExtractor
   * @param layerDimensionsExtractor
   * @param geographicBoundsExtractor
   * @param boundingBoxesExtractor
   * @param attributionExtractor
   * @param identifiersExtractor
   * @param metadataUrlsExtractor
   * @param dataUrlsExtractor
   * @param featureListUrlsExtractor
   * @param stylesExtractor
   * @param ns
   */
  constructor(
    private readonly keywordsExtractor: XmlDataExtractor<Keyword[] | undefined>,
    private readonly crsExtractor: XmlDataExtractor<Layer["crs"]>,
    private readonly layerDimensionsExtractor: XmlDataExtractor<
      Layer["dimensions"]
    >,
    private readonly geographicBoundsExtractor: XmlDataExtractor<
      Layer["geographicBounds"]
    >,
    private readonly boundingBoxesExtractor: XmlDataExtractor<
      Layer["boundingBoxes"]
    >,
    private readonly attributionExtractor: XmlDataExtractor<
      Layer["attribution"]
    >,
    private readonly identifiersExtractor: XmlDataExtractor<
      Layer["identifiers"]
    >,
    private readonly metadataUrlsExtractor: XmlDataExtractor<
      Layer["metadataUrls"]
    >,
    private readonly dataUrlsExtractor: XmlDataExtractor<Layer["dataUrls"]>,
    private readonly featureListUrlsExtractor: XmlDataExtractor<
      Layer["featureListUrls"]
    >,
    private readonly stylesExtractor: XmlDataExtractor<Layer["styles"]>,
    private readonly ns: string
  ) {}

  /**
   * @inheritdoc
   */
  createNodeDataExtractor(): SingleNodeDataExtractorFn<Layer[]> {
    return map()
      .toNodesArray(withNamespace("Layer", this.ns))
      .mandatory()
      .asArray()
      .ofRecursiveObjects<Layer>((recursion) => ({
        title: map()
          .toNode(withNamespace("Title", this.ns))
          .mandatory()
          .asString(),
        crs: this.crsExtractor,
        name: map().toNode(withNamespace("Name", this.ns)).asString(),
        description: map()
          .toNode(withNamespace("Abstract", this.ns))
          .asString(),
        keywords: this.keywordsExtractor,
        geographicBounds: this.geographicBoundsExtractor,
        boundingBoxes: this.boundingBoxesExtractor,
        dimensions: this.layerDimensionsExtractor,
        attribution: this.attributionExtractor,
        identifiers: this.identifiersExtractor,
        metadataUrls: this.metadataUrlsExtractor,
        dataUrls: this.dataUrlsExtractor,
        featureListUrls: this.featureListUrlsExtractor,
        styles: this.stylesExtractor,
        scaleHint: map()
          .toNode(withNamespace("ScaleHint", this.ns))
          .asObject({
            min: map().toNode("@min").mandatory().asNumber(),
            max: map().toNode("@max").mandatory().asNumber(),
          }),
        queryable: map().toNode("@queryable").asBoolean(),
        cascaded: map().toNode("@cascaded").asNumber(),
        opaque: map().toNode("@opaque").asBoolean(),
        noSubsets: map().toNode("@noSubsets").asBoolean(),
        fixedWidth: map().toNode("@fixedWidth").asNumber(),
        fixedHeight: map().toNode("@fixedHeight").asNumber(),
        layers: map()
          .toNodesArray(withNamespace("Layer", this.ns))
          .asArray()
          .ofRecursiveObjects(recursion),
      }))
      .createNodeDataExtractor();
  }
}
