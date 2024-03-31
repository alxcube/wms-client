import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { UnifiedCapabilitiesResponse } from "../../../UnifiedCapabilitiesResponse";

import type { KeywordsExtractorFactory } from "./KeywordsExtractorFactory";

export class ServiceDataExtractorFactory
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
        url: this.buildLinkUrlDataExtractor(),
        contactInformation: map()
          .toNode("ContactInformation")
          .asObject({
            contactPerson: map()
              .toNode("ContactPersonPrimary")
              .asObject({
                name: map().toNode("ContactPerson").mandatory().asString(),
                organization: map()
                  .toNode("ContactOrganization")
                  .mandatory()
                  .asString(),
              }),
            position: map().toNode("ContactPosition").asString(),
            address: map()
              .toNode("ContactAddress")
              .asObject({
                addressType: map()
                  .toNode("AddressType")
                  .asString()
                  .withDefault(""),
                address: map().toNode("Address").asString().withDefault(""),
                city: map().toNode("City").asString().withDefault(""),
                stateOrProvince: map()
                  .toNode("StateOrProvince")
                  .asString()
                  .withDefault(""),
                postCode: map().toNode("PostCode").asString().withDefault(""),
                country: map().toNode("Country").asString().withDefault(""),
              }),
            telephone: map().toNode("ContactVoiceTelephone").asString(),
            fax: map().toNode("ContactFacsimileTelephone").asString(),
            email: map().toNode("ContactElectronicMailAddress").asString(),
          }),
        fees: map().toNode("Fees").asString(),
        accessConstraints: map().toNode("AccessConstraints").asString(),
      })
      .createNodeDataExtractor();
  }

  private buildLinkUrlDataExtractor(): SingleNodeDataExtractorFnFactory<string> {
    return map().toNode("OnlineResource/@xlink:href").mandatory().asString();
  }
}
