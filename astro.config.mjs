// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

import sanity from "@sanity/astro";

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    react(),
    sanity({
      // Astro does not directly support environment variables in the config file
      // https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET,
      useCdn: true,
      studioBasePath: "/studio",
      stega: {
        studioUrl: "/studio",
      },
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
    optimizeDeps: {
      include: [
        "react/compiler-runtime",
        "lodash/isObject.js",
        "lodash/groupBy.js",
        "lodash/keyBy.js",
        "lodash/partition.js",
        "lodash/sortedIndex.js",
      ],
    },
  },
});
