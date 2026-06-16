import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  minify: true,
  sourcemap: true,
  deps: {
    onlyBundle: ["irc-replies"],
  },
});

export default config;
