import type { ExceptionFormat } from "../../../error";
import type { ContactInformation } from "./ContactInformation";
import type { Keyword } from "./Keyword";
import type { Layer } from "./Layer";
import type { OperationType } from "./OperationType";

export interface UnifiedCapabilitiesResponse {
  version: string;
  updateSequence?: string;
  service: {
    title: string;
    url: string;
    description?: string;
    keywords?: Keyword[];
    contactInformation?: ContactInformation;
    fees?: string;
    accessConstraints?: string;
    layerLimit?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
  capability: {
    request: {
      getCapabilities: OperationType;
      getMap: OperationType;
      getFeatureInfo?: OperationType;
      describeLayer?: OperationType;
    };
    exceptionFormats: ExceptionFormat[];
    layers: Layer[];
  };
}
