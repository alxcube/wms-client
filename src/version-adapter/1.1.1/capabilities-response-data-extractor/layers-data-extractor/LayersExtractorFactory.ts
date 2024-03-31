import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Layer } from "../../../../wms-data-types/Layer";
import type { KeywordsExtractorFactory } from "../KeywordsExtractorFactory";
import type { LayerAttributionExtractorFactory } from "./LayerAttributionExtractorFactory";
import type { LayerAuthorityUrlsExtractorFactory } from "./LayerAuthorityUrlsExtractorFactory";
import type { LayerBoundingBoxesExtractorFactory } from "./LayerBoundingBoxesExtractorFactory";
import type { LayerCrsExtractorFactory } from "./LayerCrsExtractorFactory";
import type { LayerDimensionsExtractorFactory } from "./LayerDimensionsExtractorFactory";
import type { LayerGeographicBoundsExtractorFactory } from "./LayerGeographicBoundsExtractorFactory";
import type { LayerIdentifiersExtractorFactory } from "./LayerIdentifiersExtractorFactory";
import type { LayerMetadataUrlsExtractorFactory } from "./LayerMetadataUrlsExtractorFactory";
import type { LayerStylesExtractorFactory } from "./LayerStylesExtractorFactory";
import type { ResourceUrlsExtractorFactory } from "./ResourceUrlsExtractorFactory";

export class LayersExtractorFactory
  implements SingleNodeDataExtractorFnFactory<Layer[]>
{
  constructor(
    private readonly keywordsDataExtractor: KeywordsExtractorFactory,
    private readonly crsExtractorFactory: LayerCrsExtractorFactory,
    private readonly layerDimensionsExtractorFactory: LayerDimensionsExtractorFactory,
    private readonly geographicBoundsExtractorFactory: LayerGeographicBoundsExtractorFactory,
    private readonly boundingBoxesExtractorFactory: LayerBoundingBoxesExtractorFactory,
    private readonly attributionExtractorFactory: LayerAttributionExtractorFactory,
    private readonly authorityUrlsExtractorFactory: LayerAuthorityUrlsExtractorFactory,
    private readonly identifiersExtractorFactory: LayerIdentifiersExtractorFactory,
    private readonly metadataUrlsExtractorFactory: LayerMetadataUrlsExtractorFactory,
    private readonly resourceUrlsExtractorFactory: ResourceUrlsExtractorFactory,
    private readonly stylesExtractorFactory: LayerStylesExtractorFactory
  ) {}

  createNodeDataExtractor(): SingleNodeDataExtractorFn<Layer[]> {
    return map()
      .toNodesArray("Layer")
      .mandatory()
      .asArray()
      .ofRecursiveObjects<Layer>((recursion) => ({
        title: map().toNode("Title").mandatory().asString(),
        crs: this.crsExtractorFactory,
        name: map().toNode("Name").asString(),
        description: map().toNode("Abstract").asString(),
        keywords: this.keywordsDataExtractor,
        geographicBounds: this.geographicBoundsExtractorFactory,
        boundingBoxes: this.boundingBoxesExtractorFactory,
        dimensions: this.layerDimensionsExtractorFactory,
        attribution: this.attributionExtractorFactory,
        authorityUrls: this.authorityUrlsExtractorFactory,
        identifiers: this.identifiersExtractorFactory,
        metadataUrls: this.metadataUrlsExtractorFactory,
        dataUrls:
          this.resourceUrlsExtractorFactory.createForNodeName("DataURL"),
        featureListUrls:
          this.resourceUrlsExtractorFactory.createForNodeName("FeatureListURL"),
        styles: this.stylesExtractorFactory,
        scaleHint: map()
          .toNode("ScaleHint")
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
          .toNodesArray("Layer")
          .asArray()
          .ofRecursiveObjects(recursion),
      }))
      .createNodeDataExtractor();
  }
}
