import type { MapRequestParams } from "./MapRequestParams";
import { negotiate } from "./negotiate";

//const client = await negotiate("https://wms.gebco.net/mapserv");
// const client = await negotiate(
//   "https://api.ellipsis-drive.com/v3/ogc/wms/085f5e10-63b6-4e8f-a4c6-dce9689100d3"
// );
const client = await negotiate(
  "https://api.ellipsis-drive.com/v3/ogc/wms/801b0d7d-94f2-4425-951e-1f97deeb7ddb"
);

//window.wmsClient = client;

const capabilities = await client.getCapabilities();

console.log(capabilities);

// const getMapParams: MapRequestParams = {
//   crs: "EPSG:4326",
//   layers: [{ layer: "gebco_latest" }],
//   bounds: {
//     minX: -180,
//     minY: -90,
//     maxX: 360,
//     maxY: 90,
//   },
//   format: "image/jpeg",
//   width: 1200,
//   height: 600,
//   exceptionsFormat: "INIMAGE",
// };

const getMapParams: MapRequestParams = {
  crs: "EPSG:3857",
  layers: [
    {
      layer:
        "fb79bbf4-80e0-4a3d-8adc-6ed155dd741f_2eeb5eb0-69b7-4fb6-807c-79654a9687dc",
    },
  ],
  bounds: {
    minX: -20037506.113610182,
    minY: -20037509.914550383,
    maxX: 20037506.113610182,
    maxY: 20037509.914550394,
  },
  format: "image/jpeg",
  width: 1200,
  height: 600,
  exceptionsFormat: "INIMAGE",
};

const mapImage = await client.getMap(getMapParams);
const blob = new Blob([mapImage]);
const reader = new FileReader();
reader.onload = () => {
  const img = new Image();
  img.src = reader.result as string;
  document.body.appendChild(img);
};
reader.readAsDataURL(blob);
