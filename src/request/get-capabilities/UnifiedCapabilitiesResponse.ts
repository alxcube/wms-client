import type { ExceptionFormat } from "../../ExceptionFormat";
import type { Keyword } from "../../wms-data-types/Keyword";
import type { Layer } from "../../wms-data-types/Layer";

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
    };
    exceptionFormats: ExceptionFormat[];
    layers: Layer[];
  };
}

export interface ContactInformation {
  contactPerson?: ContactPerson;
  position?: string;
  address?: ContactAddress;
  telephone?: string;
  fax?: string;
  email?: string;
}

export interface ContactAddress {
  addressType: string;
  address: string;
  city: string;
  stateOrProvince: string;
  postCode: string;
  country: string;
}

export interface ContactPerson {
  name: string;
  organization: string;
}

export interface OperationType {
  responseFormats: string[];
  httpGetUrl: string;
}
