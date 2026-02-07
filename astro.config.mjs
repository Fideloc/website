// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    sanity({
      // Astro does not directly support environment variables in the config file
      // https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
      projectId: "sjagkr9a",
      dataset: "production",
      studioBasePath: '/studio'
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
