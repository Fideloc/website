// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import vercel from '@astrojs/vercel';
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
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

  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: "Satoshi",
      cssVariable: "--astro-font-heading",
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--astro-font-body",
      weights: [400, 500, 600],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
