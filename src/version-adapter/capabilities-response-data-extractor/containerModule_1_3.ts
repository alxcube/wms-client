import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../TypesMap";
import { CapabilitiesSectionExtractor } from "./CapabilitiesSectionExtractor";
import { exceptionFormatExtractor_1_3 } from "./exceptionFormatExtractor_1_3";
import { GenericCapabilitiesResponseDataExtractor } from "./GenericCapabilitiesResponseDataExtractor";
import { KeywordsExtractor } from "./KeywordsExtractor";
import { containerModule_1_3 as layersExtractorModule } from "./layers-data-extractor/containerModule_1_3";
import { ServiceSectionExtractor } from "./ServiceSectionExtractor";
import { wmsXmlNamespace } from "./wmsXmlNamespace";
import { xlinkXmlNamespace } from "./xlinkXmlNamespace";

export const containerModule_1_3: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    // Name corresponds to version implementation. Used to distinguish between implementations of common interfaces
    // for specific WMS versions.
    const name = "1.3.0";

    // XML namespace, used in GetCapability response XML document. Used by generic data extractors, generally when
    // the only difference in XML structure is namespace.
    const nameSpace = constant("wms");

    // XML namespaces for performing xpath lookup
    const namespaces = constant({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    // Root node name of GetCapabilities response XML (without namespace)
    const rootNodeName = constant("WMS_Capabilities");

    // Keyword[] extractor
    container.implement(
      "XmlDataExtractor<Keyword[]>",
      KeywordsExtractor,
      [nameSpace],
      { name }
    );

    // UnifiedCapabilitiesResponse extractor
    container.implement(
      "CapabilitiesResponseDataExtractor",
      GenericCapabilitiesResponseDataExtractor,
      [
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
          name,
        },
        {
          service: "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
          name,
        },
        namespaces,
      ],
      { name }
    );

    // UnifiedCapabilitiesResponse["service"] extractor
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[service]>",
      ServiceSectionExtractor,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        rootNodeName,
        nameSpace,
      ],
      { name }
    );

    // UnifiedCapabilitiesResponse["capability"] extractor
    container.implement(
      "XmlDataExtractor<UnifiedCapabilitiesResponse[capability]>",
      CapabilitiesSectionExtractor,
      [
        { service: "XmlDataExtractor<Layer[]>", name },
        { service: "XmlDataExtractor<ExceptionFormat[]>", name },
        rootNodeName,
        nameSpace,
      ],
      { name }
    );

    // Layer[] extractor module
    container.loadModule(layersExtractorModule);

    // ExceptionFormat[] extractor
    container.registerConstant(
      "XmlDataExtractor<ExceptionFormat[]>",
      exceptionFormatExtractor_1_3,
      { name }
    );
  },
};
