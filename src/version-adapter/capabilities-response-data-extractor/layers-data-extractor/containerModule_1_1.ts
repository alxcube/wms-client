import { constant } from "@alxcube/di-container";
import type { ServiceContainer, ServiceModule } from "@alxcube/di-container";
import type { TypesMap } from "../../../TypesMap";
import { AttributionExtractor } from "./AttributionExtractor";
import { BoundingBoxesExtractor } from "./BoundingBoxesExtractor";
import { CrsExtractor } from "./CrsExtractor";
import { DimensionsExtractor_1_1 } from "./DimensionsExtractor_1_1";
import { geographicBoundsExtractor_1_1 } from "./geographicBoundsExtractor_1_1";
import { IdentifiersExtractor } from "./IdentifiersExtractor";
import { LayersExtractor } from "./LayersExtractor";
import { MetadataUrlsExtractor } from "./MetadataUrlsExtractor";
import { ResourceUrlsExtractor } from "./ResourceUrlsExtractor";
import { StylesExtractor } from "./StylesExtractor";
import { StyleUrlExtractor_1_1 } from "./StyleUrlExtractor_1_1";

/**
 * Service module of container registrations, related to <Layer> node data extractors for WMS v 1.1.1.
 */
export const containerModule_1_1: ServiceModule<TypesMap> = {
  register(container: ServiceContainer<TypesMap>) {
    // Name corresponds to version implementation. Used to distinguish between implementations of common interfaces
    // for specific WMS versions.
    const name = "1.1.1";

    // XML namespace, used in GetCapability response XML document. Used by generic data extractors, generally when
    // the only difference in XML structure is namespace.
    const nameSpace = constant("");

    // Layer[] extractor
    container.implement(
      "XmlDataExtractor<Layer[]>",
      LayersExtractor,
      [
        { service: "XmlDataExtractor<Keyword[]>", name },
        { service: "XmlDataExtractor<Layer[crs]>", name },
        { service: "XmlDataExtractor<Layer[dimensions]>", name },
        { service: "XmlDataExtractor<Layer[geographicBounds]>", name },
        { service: "XmlDataExtractor<Layer[boundingBoxes]>", name },
        { service: "XmlDataExtractor<Layer[attribution]>", name },
        { service: "XmlDataExtractor<Layer[identifiers]>", name },
        { service: "XmlDataExtractor<Layer[metadataUrls]>", name },
        { service: "XmlDataExtractor<Layer[dataUrls]>", name },
        { service: "XmlDataExtractor<Layer[featureListUrls]>", name },
        { service: "XmlDataExtractor<Layer[styles]>", name },
        nameSpace,
      ],
      { name }
    );

    // Layer["crs"] extractor
    container.implement(
      "XmlDataExtractor<Layer[crs]>",
      CrsExtractor,
      [constant("SRS")],
      { name }
    );

    // Layer["dimensions"] extractor
    container.implement(
      "XmlDataExtractor<Layer[dimensions]>",
      DimensionsExtractor_1_1,
      [],
      { name }
    );

    // Layer["geographicBounds"] exractor
    container.registerConstant(
      "XmlDataExtractor<Layer[geographicBounds]>",
      geographicBoundsExtractor_1_1,
      { name }
    );

    // Layer["boundingBoxes"] extractor
    container.implement(
      "XmlDataExtractor<Layer[boundingBoxes]>",
      BoundingBoxesExtractor,
      [constant("SRS"), nameSpace],
      { name }
    );

    // Layer["attribution"] extractor
    container.implement(
      "XmlDataExtractor<Layer[attribution]>",
      AttributionExtractor,
      [nameSpace],
      { name }
    );

    // Layer["identifiers"] extractor
    container.implement(
      "XmlDataExtractor<Layer[identifiers]>",
      IdentifiersExtractor,
      [nameSpace],
      { name }
    );

    // Layer["metadataUrls"] extractor
    container.implement(
      "XmlDataExtractor<Layer[metadataUrls]>",
      MetadataUrlsExtractor,
      [nameSpace],
      { name }
    );

    // Layer["dataUrls"] extractor
    container.implement(
      "XmlDataExtractor<Layer[dataUrls]>",
      ResourceUrlsExtractor,
      [constant("DataUrl"), nameSpace],
      { name }
    );

    // Layer["featureListUrls"] extractor
    container.implement(
      "XmlDataExtractor<Layer[featureListUrls]>",
      ResourceUrlsExtractor,
      [constant("FeatureListURL"), nameSpace],
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
    container.implement(
      "XmlDataExtractor<Layer[styles][styleUrl]>",
      StyleUrlExtractor_1_1,
      [nameSpace],
      { name }
    );
  },
};
