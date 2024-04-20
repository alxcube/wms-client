import { constant } from "../../../service-container/constant";
import type {
  ServiceContainer,
  ServiceModule,
} from "../../../service-container/ServiceContainer";
import type { TypesMap } from "../../../TypesMap";
import { undefinedExtractor } from "../undefinedExtractor";
import { dataUrlsExtractor_1_0 } from "./dataUrlsExtractor_1_0";
import { LayersExtractor } from "./LayersExtractor";
import { StylesExtractor } from "./StylesExtractor";
import { styleUrlExtractor_1_0 } from "./styleUrlExtractor_1_0";

export const containerModule_1_0: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    // Name corresponds to version implementation. Used to distinguish between implementations of common interfaces
    // for specific WMS versions.
    const name = "1.0.0";

    // XML namespace, used in GetCapability response XML document. Used by generic data extractors, generally when
    // the only difference in XML structure is namespace.
    const nameSpace = constant("");

    // Layer[] extractor
    container.implement(
      "XmlDataExtractor<Layer[]>",
      LayersExtractor,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        { service: "XmlDataExtractor<Layer[crs]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[dimensions]>", name },
        { service: "XmlDataExtractor<Layer[geographicBounds]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[boundingBoxes]>", name: "1.1.1" },
        { service: "XmlDataExtractor<Layer[attribution]>", name },
        { service: "XmlDataExtractor<Layer[authorityUrls]>", name },
        { service: "XmlDataExtractor<Layer[identifiers]>", name },
        { service: "XmlDataExtractor<Layer[metadataUrls]>", name },
        { service: "XmlDataExtractor<Layer[dataUrls]>", name },
        { service: "XmlDataExtractor<Layer[featureListUrls]>", name },
        { service: "XmlDataExtractor<Layer[styles]>", name },
        nameSpace,
      ],
      { name }
    );

    // Layer["dataUrls"] extractor
    container.registerConstant(
      "XmlDataExtractor<Layer[dataUrls]>",
      dataUrlsExtractor_1_0,
      { name }
    );

    // Layer["styles"] extractor
    container.implement(
      "XmlDataExtractor<Layer[styles]>",
      StylesExtractor,
      [
        { service: "XmlDataExtractor<Layer[styles][styleUrl]>", name },
        nameSpace,
      ],
      { name }
    );

    // Layer["styles"][number]["styleUrl"] extractor
    container.registerConstant(
      "XmlDataExtractor<Layer[styles][styleUrl]>",
      styleUrlExtractor_1_0,
      { name }
    );

    // The following data doesn't exist in v1.0.0, so use simple undefined extractor
    container.registerConstant(
      "XmlDataExtractor<Layer[dimensions]>",
      undefinedExtractor,
      { name }
    );
    container.registerConstant(
      "XmlDataExtractor<Layer[attribution]>",
      undefinedExtractor,
      { name }
    );
    container.registerConstant(
      "XmlDataExtractor<Layer[authorityUrls]>",
      undefinedExtractor,
      { name }
    );
    container.registerConstant(
      "XmlDataExtractor<Layer[identifiers]>",
      undefinedExtractor,
      { name }
    );
    container.registerConstant(
      "XmlDataExtractor<Layer[metadataUrls]>",
      undefinedExtractor,
      { name }
    );
    container.registerConstant(
      "XmlDataExtractor<Layer[featureListUrls]>",
      undefinedExtractor,
      { name }
    );
  },
};
