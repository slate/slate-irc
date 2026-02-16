import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: "src/index.js",
  minify: true,
  sourcemap: true,
  inlineOnly: ["irc-replies"],
});

export default config;
