import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://nacia.ryuko.my.id",
  output: "server",
  adapter: cloudflare(),
  integrations: [solid(), mdx()],
  vite: { plugins: [tailwindcss()] },
});
