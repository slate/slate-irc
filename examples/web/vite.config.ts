import { defineConfig, type UserConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const config: UserConfig = defineConfig({
  plugins: [
    nodePolyfills({
      include: ["buffer", "events", "process", "stream", "string_decoder", "util"],
      overrides: {
        string_decoder: "string_decoder/lib/string_decoder.js",
      },
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
});

export default config;
