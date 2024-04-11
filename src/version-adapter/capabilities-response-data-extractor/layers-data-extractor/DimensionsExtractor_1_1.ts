import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { XPathSelect } from "xpath";
import type { Dimension } from "../../../wms-data-types/Dimension";
import type { Layer } from "../../../wms-data-types/Layer";

interface ExtentElementData {
  default?: string;
  multipleValues?: boolean;
  nearestValue?: boolean;
  current?: boolean;
  value?: string;
}
export class DimensionsExtractor_1_1
  implements SingleNodeDataExtractorFnFactory<Layer["dimensions"]>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<Layer["dimensions"]> {
    return (layerNode, select) => {
      if (!this.hasExtentOrDimensionChild(layerNode, select)) {
        // Do not parse dimensions, when Layer node has neither Dimension, nor Extent child elements.
        return undefined;
      }

      const dimensions: Dimension[] = [];

      // Create object for accessing dimension data by name
      const dimensionsMap = this.getDimensionsMap(layerNode, select);

      // Find all Extent child elements in current Layer node.
      const extentElements = select("Extent", layerNode) as Element[];
      for (const extentEl of extentElements) {
        const name = select("string(@name)", extentEl) as string;

        if (!(name in dimensionsMap)) {
          continue;
        }

        // Get initial data from Dimension node
        const dimension = { ...dimensionsMap[name] };

        // Add info from Extent node to Dimension object
        Object.assign(
          dimension,
          this.extractExtentElementData(extentEl, select)
        );

        dimensions.push(dimension);
      }

      return dimensions;
    };
  }

  private hasExtentOrDimensionChild(
    layerNode: Node,
    select: XPathSelect
  ): boolean {
    return (
      (select("boolean(Dimension)", layerNode) as boolean) ||
      (select("boolean(Extent)", layerNode) as boolean)
    );
  }

  private getDimensionElementsRecursive(
    node: Node,
    select: XPathSelect
  ): Element[] {
    const dimensionElements = select("Dimension", node) as Element[];
    if (node.parentNode && node.parentNode.nodeName === "Layer") {
      dimensionElements.push(
        ...this.getDimensionElementsRecursive(node.parentNode, select)
      );
    }
    return dimensionElements;
  }

  private getPrecedingDimensionElements(
    layerNode: Node,
    select: XPathSelect
  ): Element[] {
    return select("preceding::Layer/Dimension", layerNode) as Element[];
  }

  private getDimensionsMap(
    layerNode: Node,
    select: XPathSelect
  ): {
    [key: string]: NonNullable<Layer["dimensions"]>[number];
  } {
    const dimensionElements = [
      ...this.getDimensionElementsRecursive(layerNode, select),
      ...this.getPrecedingDimensionElements(layerNode, select),
    ];

    const dimensionsMap: {
      [key: string]: NonNullable<Layer["dimensions"]>[number];
    } = {};

    for (const dimensionElement of dimensionElements) {
      const name = select("string(@name)", dimensionElement) as string;
      if (name in dimensionsMap) {
        continue;
      }
      dimensionsMap[name] = {
        name,
        units: select("string(@units)", dimensionElement) as string,
      };
    }

    return dimensionsMap;
  }

  private extractExtentElementData(
    extent: Element,
    select: XPathSelect
  ): ExtentElementData {
    return map()
      .toNode(".")
      .mandatory()
      .asObject({
        default: map().toNode("@default").asString(),
        multipleValues: map().toNode("@multipleValues").asBoolean(),
        nearestValue: map().toNode("@nearestValue").asBoolean(),
        current: map().toNode("@current").asBoolean(),
        value: map().toNode(".").asString(),
      })
      .createNodeDataExtractor()(extent, select);
  }
}
