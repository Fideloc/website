import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

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

export default defineConfig({
  projectId: projectId ?? "",
  dataset: dataset ?? "",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
