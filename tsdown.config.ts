import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  minify: true,
  sourcemap: true,
  inlineOnly: ["irc-replies"],
});

export default config;
