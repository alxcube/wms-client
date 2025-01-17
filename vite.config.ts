import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import banner from "vite-plugin-banner";
import packageInfo from "./package.json";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      strictOutput: false,
      include: "./src",
    }),
    banner(
      `${packageInfo.name} ${packageInfo.version}\n© ${new Date().getFullYear()} ${packageInfo.author}\nLicense: ${packageInfo.license}`
    ),
    terser({ format: { comments: false } }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "alxcube.wmsClient",
      fileName: "wms-client",
    },
    rollupOptions: {
      external: [
        "axios",
        "@xmldom/xmldom",
        "xpath",
        "@alxcube/xml-mapper",
        "@alxcube/di-container",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          axios: "axios",
          xpath: "xpath",
          "@alxcube/xml-mapper": "alxcube.xmlMapper",
          "@alxcube/di-container": "alxcube.diContainer",
        },
      },
    },
  },
});
