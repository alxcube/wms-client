import { constant } from "../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../service-container/ServiceContainer";
import type { TypesMap } from "../TypesMap";
import { KeywordsExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/KeywordsExtractorFactory";
import { ServiceSectionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/ServiceSectionExtractorFactory";
import { UpdateSequenceExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/UpdateSequenceExtractorFactory";
import { VersionExtractorFactory } from "./1.1.1/capabilities-response-data-extractor/VersionExtractorFactory";
import { capabilitiesRequestParamsTransformer } from "./1.3.0/capabilitiesRequestParamsTransformer";
import { CapabilitiesResponseDataExtractor } from "./1.3.0/capabilities-response-data-extractor/CapabilitiesResponseDataExtractor";
import { ErrorsExtractor } from "./1.3.0/ErrorsExtractor";
import { MapRequestParamsTransformer } from "./1.3.0/MapRequestParamsTransformer";
import { BaseWmsVersionAdapter } from "./BaseWmsVersionAdapter";

export const versionAdapterContainerModule_1_3_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    const name = "1.3.0";
    const rootNodeName = "wms:WMS_Capabilities";
    const namespace = "wms";

    container.registerClass(
      BaseWmsVersionAdapter,
      [
        constant("1.3.0"),
        { service: "WmsCapabilitiesRequestParamsTransformer", name },
        { service: "WmsCapabilitiesResponseDataExtractor", name },
        { service: "WmsMapRequestParamsTransformer", name },
        { service: "WmsErrorsExtractor", name },
      ],
      { name }
    );
    container.registerImplementation(
      "WmsVersionAdapter",
      { service: BaseWmsVersionAdapter, name },
      { name }
    );

    container.registerConstant(
      "WmsCapabilitiesRequestParamsTransformer",
      capabilitiesRequestParamsTransformer,
      { name }
    );

    // Keywords extractor v1.1.1
    container.registerClass(KeywordsExtractorFactory, [constant(namespace)], {
      name,
    });
    container.registerImplementation(
      "XmlDataExtractor<Keyword[]>",
      { service: KeywordsExtractorFactory, name },
      { name }
    );

    // Version extractor v1.3.0
    container.registerClass(VersionExtractorFactory, [constant(rootNodeName)], {
      name,
    });
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[version]>",
      { service: VersionExtractorFactory, name },
      { name }
    );

    // UpdateSequence extractor v1.3.0
    container.registerClass(
      UpdateSequenceExtractorFactory,
      [constant(rootNodeName)],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[updateSequence]>",
      { service: UpdateSequenceExtractorFactory, name },
      { name }
    );

    // Service section extractor v1.3.0
    container.registerClass(
      ServiceSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        constant(rootNodeName),
        constant(namespace),
      ],
      { name }
    );
    container.registerImplementation(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      { service: ServiceSectionExtractorFactory, name },
      { name }
    );

    container.registerClass(CapabilitiesResponseDataExtractor, [
      {
        service: "XmlDataExtractor<UnifiedCapabilitiesResponse[version]>",
        name,
      },
      {
        service:
          "XmlDataExtractor<UnifiedCapabilitiesResponse[updateSequence]>",
        name,
      },
      {
        service: "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
        name,
      },
    ]);
    container.registerImplementation(
      "WmsCapabilitiesResponseDataExtractor",
      CapabilitiesResponseDataExtractor,
      { name }
    );

    container.registerClass(MapRequestParamsTransformer, []);
    container.registerImplementation(
      "WmsMapRequestParamsTransformer",
      MapRequestParamsTransformer,
      { name }
    );

    container.registerClass(ErrorsExtractor, []);
    container.registerImplementation("WmsErrorsExtractor", ErrorsExtractor, {
      name,
    });
  },
};
