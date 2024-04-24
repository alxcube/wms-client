import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../utils";
import type {
  ContactAddress,
  ContactInformation,
  ContactPerson,
  UnifiedCapabilitiesResponse,
  Keyword,
} from "./data-types";
import type { XmlDataExtractor } from "./XmlDataExtractor";

export class ServiceSectionExtractor
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["service"]>
{
  constructor(
    private readonly keywordsDataExtractor: XmlDataExtractor<
      Keyword[] | undefined
    >,
    private readonly rootNodeName: string,
    private readonly ns: string
  ) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["service"]
  > {
    return map()
      .toNode(
        `/${withNamespace(this.rootNodeName, this.ns)}/${withNamespace("Service", this.ns)}`
      )
      .mandatory()
      .asObject({
        title: map().toNode(this.withNamespace("Title")).mandatory().asString(),
        description: map().toNode(this.withNamespace("Abstract")).asString(),
        keywords: this.keywordsDataExtractor,
        url: map()
          .toNode(`${this.withNamespace("OnlineResource")}/@xlink:href`)
          .asString()
          .withDefault(""),
        contactInformation: this.buildContactInformationExtractor(),
        fees: map().toNode(this.withNamespace("Fees")).asString(),
        accessConstraints: map()
          .toNode(this.withNamespace("AccessConstraints"))
          .asString(),
        layerLimit: map().toNode(this.withNamespace("LayerLimit")).asNumber(),
        maxWidth: map().toNode(this.withNamespace("MaxWidth")).asNumber(),
        maxHeight: map().toNode(this.withNamespace("MaxHeight")).asNumber(),
      })
      .createNodeDataExtractor();
  }

  private buildContactInformationExtractor(): SingleNodeDataExtractorFnFactory<
    ContactInformation | undefined
  > {
    return map()
      .toNode(this.withNamespace("ContactInformation"))
      .asObject({
        contactPerson: this.buildContactPersonExtractor(),
        position: map()
          .toNode(this.withNamespace("ContactPosition"))
          .asString(),
        address: this.buildAddressExtractor(),
        telephone: map()
          .toNode(this.withNamespace("ContactVoiceTelephone"))
          .asString(),
        fax: map()
          .toNode(this.withNamespace("ContactFacsimileTelephone"))
          .asString(),
        email: map()
          .toNode(this.withNamespace("ContactElectronicMailAddress"))
          .asString(),
      });
  }

  private buildContactPersonExtractor(): SingleNodeDataExtractorFnFactory<
    ContactPerson | undefined
  > {
    return map()
      .toNode(this.withNamespace("ContactPersonPrimary"))
      .asObject({
        name: map()
          .toNode(this.withNamespace("ContactPerson"))
          .mandatory()
          .asString(),
        organization: map()
          .toNode(this.withNamespace("ContactOrganization"))
          .mandatory()
          .asString(),
      });
  }

  private buildAddressExtractor(): SingleNodeDataExtractorFnFactory<
    ContactAddress | undefined
  > {
    return map()
      .toNode(this.withNamespace("ContactAddress"))
      .asObject({
        addressType: map()
          .toNode(this.withNamespace("AddressType"))
          .asString()
          .withDefault(""),
        address: map()
          .toNode(this.withNamespace("Address"))
          .asString()
          .withDefault(""),
        city: map()
          .toNode(this.withNamespace("City"))
          .asString()
          .withDefault(""),
        stateOrProvince: map()
          .toNode(this.withNamespace("StateOrProvince"))
          .asString()
          .withDefault(""),
        postCode: map()
          .toNode(this.withNamespace("PostCode"))
          .asString()
          .withDefault(""),
        country: map()
          .toNode(this.withNamespace("Country"))
          .asString()
          .withDefault(""),
      });
  }

  private withNamespace(nodeName: string): string {
    return this.ns.length ? `${this.ns}:${nodeName}` : nodeName;
  }
}
