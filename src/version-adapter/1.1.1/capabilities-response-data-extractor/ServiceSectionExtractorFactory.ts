import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type {
  ContactAddress,
  ContactInformation,
  ContactPerson,
  UnifiedCapabilitiesResponse,
} from "../../../UnifiedCapabilitiesResponse";

import type { KeywordsExtractorFactory } from "./KeywordsExtractorFactory";

export class ServiceSectionExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["service"]>
{
  constructor(
    private readonly keywordsDataExtractor: KeywordsExtractorFactory
  ) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["service"]
  > {
    return map()
      .toNode("/WMT_MS_Capabilities/Service")
      .mandatory()
      .asObject({
        title: map().toNode("Title").mandatory().asString(),
        description: map().toNode("Abstract").asString(),
        keywords: this.keywordsDataExtractor,
        url: map().toNode("OnlineResource/@xlink:href").mandatory().asString(),
        contactInformation: this.buildContactInformationExtractor(),
        fees: map().toNode("Fees").asString(),
        accessConstraints: map().toNode("AccessConstraints").asString(),
      })
      .createNodeDataExtractor();
  }

  private buildContactInformationExtractor(): SingleNodeDataExtractorFnFactory<
    ContactInformation | undefined
  > {
    return map()
      .toNode("ContactInformation")
      .asObject({
        contactPerson: this.buildContactPersonExtractor(),
        position: map().toNode("ContactPosition").asString(),
        address: this.buildAddressExtractor(),
        telephone: map().toNode("ContactVoiceTelephone").asString(),
        fax: map().toNode("ContactFacsimileTelephone").asString(),
        email: map().toNode("ContactElectronicMailAddress").asString(),
      });
  }

  private buildContactPersonExtractor(): SingleNodeDataExtractorFnFactory<
    ContactPerson | undefined
  > {
    return map()
      .toNode("ContactPersonPrimary")
      .asObject({
        name: map().toNode("ContactPerson").mandatory().asString(),
        organization: map()
          .toNode("ContactOrganization")
          .mandatory()
          .asString(),
      });
  }

  private buildAddressExtractor(): SingleNodeDataExtractorFnFactory<
    ContactAddress | undefined
  > {
    return map()
      .toNode("ContactAddress")
      .asObject({
        addressType: map().toNode("AddressType").asString().withDefault(""),
        address: map().toNode("Address").asString().withDefault(""),
        city: map().toNode("City").asString().withDefault(""),
        stateOrProvince: map()
          .toNode("StateOrProvince")
          .asString()
          .withDefault(""),
        postCode: map().toNode("PostCode").asString().withDefault(""),
        country: map().toNode("Country").asString().withDefault(""),
      });
  }
}
