import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { locations, mainDocuments } from "./src/sanity/presentation/resolve";

// This file is loaded in two contexts:
// - Browser (Vite/Astro Studio): only import.meta.env is available
// - Node.js (Sanity CLI, typegen): only process.env is available
const projectId =
  typeof import.meta.env !== "undefined"
    ? import.meta.env.PUBLIC_SANITY_PROJECT_ID
    : process.env.PUBLIC_SANITY_PROJECT_ID;

const dataset =
  typeof import.meta.env !== "undefined"
    ? import.meta.env.PUBLIC_SANITY_DATASET
    : process.env.PUBLIC_SANITY_DATASET;

const previewUrl =
  typeof import.meta.env !== "undefined"
    ? // @see https://vercel.com/docs/environment-variables/framework-environment-variables#PUBLIC_VERCEL_URL
      (import.meta.env.PUBLIC_SITE_URL ??
        import.meta.env.PUBLIC_VERCEL_URL ??
        "http://localhost:4321")
    : (process.env.PUBLIC_SITE_URL ??
      process.env.PUBLIC_VERCEL_URL ??
      "http://localhost:4321");

export default defineConfig({
  projectId: projectId ?? "",
  dataset: dataset ?? "",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl,
      resolve: { locations, mainDocuments },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
