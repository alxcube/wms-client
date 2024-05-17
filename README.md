# @alxcube/wms-client

`@alxcube/wms-client` is a [Web Map Service (WMS)](https://www.ogc.org/standard/wms/)
client written in TypeScript.
Under the hood, it uses [Axios](https://www.npmjs.com/package/axios) for handling
HTTP requests. Works both in the browser and in Node.js environments.

Supported WMS versions: 1.0, 1.1, 1.3.

## Usage
### Installation
```shell
npm i @alxcube/wms-client
```

### Creating client for known WMS version

If the WMS version is known, you can create a client using the `createClient()`
function. This function takes the WMS URL, the adapter version, and an optional
options object, and it returns the [`WmsClient`](./src/client/WmsClient.ts) interface.
The adapter version must be compatible with the WMS version on the server.
The following adapter versions are available out of the box: `1.0.0`, `1.1.1`,
`1.3.0`.

```ts
import { createClient } from "@alxcube/wms-client";

const wmsUrl = "https://example.com/wms";
const wmsVersion = "1.3.0";
const client = createClient(wmsUrl, wmsVersion);
```

### Using version negotiation

If the WMS version is unknown, you can use the `negotiate()` function. It takes the
WMS URL and an optional options object, and returns a `Promise` that resolves to the
`WmsClient` interface upon successful negotiation.

```ts
import { negotiate } from "@alxcube/wms-client";

const wmsUrl = "https://example.com/wms";
const client = await negotiate(wmsUrl);
```

### GetCapabilities request

To retrieve WMS metadata, use `getCapabilities()` method of `WmsClient`.

```ts
console.log(await client.getCapabilities());
```

### GetMap request

Use `getMap()` method of `WmsClient` to retrieve map by given parameters. The returned
`Promise` will be resolved with `ArrayBuffer` of server response body, which can be
decoded later, assuming that consumer code is aware of response format.

```ts
const getMapParams = {
  crs: "EPSG:4326",
  layers: [{ layer: "gebco_latest" }],
  bounds: {
    minX: -90,
    minY: -180,
    maxX: 90,
    maxY: 360,
  },
  format: "image/jpeg",
  width: 1200,
  height: 600,
  exceptionsFormat: "XML",
};

// Request image
const mapImage: ArrayBuffer = await client.getMap(getMapParams);

// Make HTMLImageElement from response image ArrayBuffer
const blob = new Blob([mapImage]);
const reader = new FileReader();
reader.onload = () => {
  const img = new Image();
  img.src = reader.result as string;
  document.body.appendChild(img);
};
reader.readAsDataURL(blob);
```

### Get image URL

When your only need is to get map image url, e.g. for `src` property of
`HTMLImageElement`, you can use `getMapUrl` method.

```ts
const getMapParams = {
  crs: "EPSG:4326",
  layers: [{ layer: "gebco_latest" }],
  bounds: {
    minX: -90,
    minY: -180,
    maxX: 90,
    maxY: 360,
  },
  format: "image/jpeg",
  width: 1200,
  height: 600,
  exceptionsFormat: "INIMAGE",
};

// Create HTMLImageElement
const img = new Image();
img.src = client.getMapUrl(getMapParams);
document.body.appendChild(img);
```

### GetFeatureInfo request

To make feature info request, you use `getFeatureInfo` method. It returns `Promise`
resolving `string` of WMS response body. Since GetFeatureInfo request has no
specific format, the responsibility of decoding response is up to consuming code.

```ts
const getFeatureInfoParams = {
  crs: "EPSG:4326",
  layers: [{ layer: "gebco_latest" }],
  bounds: {
    minX: -90,
    minY: -180,
    maxX: 90,
    maxY: 360,
  },
  format: "image/jpeg",
  width: 1200,
  height: 600,
  exceptionsFormat: "XML",
  queryLayers: ["gebco_latest"],
  infoFormat: "text/html",
  x: 200,
  y: 100
};

const featureInfo = await client.getFeatureInfo(getFeatureInfoParams);
document.body.innerHTML = featureInfo;
```

### Using custom Axios instance.

You can pass custom Axios instance to `httpClient` option of `createClient()` or
`negotiate()` function. This instance will be used in all WMS requests. This may be
useful when you want to set up proxy, caching etc.

```ts
import axios from "axios";
import { negotiate } from "@alxcube/wms-client";

const wmsUrl = "https://example.com/wms";
const httpClient = axios.create();

// Configure axios instance.
// ...

const wmsClient = await negotiate(wmsUrl, { httpClient });
```