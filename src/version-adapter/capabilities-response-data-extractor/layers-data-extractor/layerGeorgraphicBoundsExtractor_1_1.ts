import { map } from "@alxcube/xml-mapper";

export const layerGeorgraphicBoundsExtractor_1_1 = map()
  .toNode("LatLonBoundingBox")
  .asObject({
    west: map().toNode("@minx").mandatory().asNumber(),
    south: map().toNode("@miny").mandatory().asNumber(),
    east: map().toNode("@maxx").mandatory().asNumber(),
    north: map().toNode("@maxy").mandatory().asNumber(),
  })
  .createNodeDataExtractor();
