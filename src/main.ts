//import { createClient } from "./createClient";
import { negotiate } from "./negotiate";

//const client = createClient("https://wms.gebco.net/mapserv", "1.1.1");
const client = await negotiate("https://wms.gebco.net/mapserv");

//window.wmsClient = client;

const capabilities = await client.getCapabilities();

console.log(capabilities);

const getMapParams = {
  crs: "EPSG:4326",
  layers: [{ layer: "gebco_latest" }],
  bounds: {
    minX: -180,
    minY: -90,
    maxX: 360,
    maxY: 90,
  },
  format: "image/jpeg",
  width: 1200,
  height: 600,
};

const mapImage = await client.getMap(getMapParams, { flipAxes: true });
const blob = new Blob([mapImage]);
const reader = new FileReader();
reader.onload = () => {
  const img = new Image();
  img.src = reader.result as string;
  document.body.appendChild(img);
};
reader.readAsDataURL(blob);
