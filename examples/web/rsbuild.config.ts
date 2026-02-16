import { defineConfig, type RsbuildConfig } from "@rsbuild/core";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";

const config: RsbuildConfig = defineConfig({
  plugins: [pluginNodePolyfill()],
});

export default config;
