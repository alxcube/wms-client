import type { Attribution } from "./Attribution";
import type { AuthorityUrl } from "./AuthorityUrl";
import type { BoundingBox } from "./BoundingBox";
import type { Dimension } from "./Dimension";
import type { GeographicBoundingBox } from "./GeographicBoundingBox";
import type { Identifier } from "./Identifier";
import type { Keyword } from "./Keyword";
import type { LayerStyle } from "./LayerStyle";
import type { MetadataUrl } from "./MetadataUrl";
import type { ResourceUrl } from "./ResourceUrl";

type DataUrl = ResourceUrl;
type FeatureListUrl = ResourceUrl;
export interface Layer {
  title: string;
  crs?: string[];
  name?: string;
  description?: string;
  keywords?: Keyword[];
  geographicBounds?: GeographicBoundingBox;
  boundingBoxes?: BoundingBox[];
  dimensions?: Dimension[];
  attribution?: Attribution;
  authorityUrls?: AuthorityUrl[];
  identifiers?: Identifier[];
  metadataUrls?: MetadataUrl[];
  dataUrls?: DataUrl[];
  featureListUrls?: FeatureListUrl[];
  styles?: LayerStyle[];
  minScaleDenominator?: number;
  maxScaleDenominator?: number;
  queryable?: boolean;
  cascaded?: number;
  opaque?: boolean;
  noSubsets?: boolean;
  fixedWidth?: number;
  fixedHeight?: number;
  layers?: Layer[];
}
