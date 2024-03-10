import type { ImageResourceUrl } from "./ImageResourceUrl";
import type { ResourceUrl } from "./ResourceUrl";

type StyleSheetUrl = ResourceUrl;
type StyleUrl = ResourceUrl;

export interface LayerStyle {
  name: string;
  title: string;
  description?: string;
  legendUrls?: ImageResourceUrl[];
  stylesheetUrl?: StyleSheetUrl;
  styleUrl?: StyleUrl;
}
