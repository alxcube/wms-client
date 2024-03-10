import { createClient } from "./createClient";

const client = createClient("https://wms.gebco.net/mapserv", "1.3.0");

const capabilities = await client.getCapabilities();

console.log(capabilities);
