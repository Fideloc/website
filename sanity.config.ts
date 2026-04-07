import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { locations, mainDocuments } from "./src/sanity/presentation/resolve";

// In the Node.js context (CLI commands like `sanity schema deploy`), this
// file is evaluated by Sanity's TS loader without inheriting `.env` values.
// Explicitly load them so PUBLIC_SANITY_* env vars are available below.
if (
  typeof process !== "undefined" &&
  typeof process.loadEnvFile === "function"
) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // .env may not exist (CI/prod) — fall through to env vars from the shell
  }
}

// This file is loaded in two contexts:
// - Browser (Vite/Astro Studio): values come from import.meta.env
// - Node.js (Sanity CLI, typegen): values come from process.env
// Sanity's CLI loader defines `import.meta.env` as an (empty) object, so we
// can't switch on its existence — read from it first, then fall back to
// process.env when the field is missing.
const projectId =
  (typeof import.meta.env !== "undefined"
    ? import.meta.env.PUBLIC_SANITY_PROJECT_ID
    : undefined) ??
  (typeof process !== "undefined"
    ? process.env.PUBLIC_SANITY_PROJECT_ID
    : undefined);

const dataset =
  (typeof import.meta.env !== "undefined"
    ? import.meta.env.PUBLIC_SANITY_DATASET
    : undefined) ??
  (typeof process !== "undefined"
    ? process.env.PUBLIC_SANITY_DATASET
    : undefined);

const previewUrl =
  (typeof import.meta.env !== "undefined"
    ? // @see https://vercel.com/docs/environment-variables/framework-environment-variables#PUBLIC_VERCEL_URL
      (import.meta.env.PUBLIC_SITE_URL ?? import.meta.env.PUBLIC_VERCEL_URL)
    : undefined) ??
  (typeof process !== "undefined"
    ? (process.env.PUBLIC_SITE_URL ?? process.env.PUBLIC_VERCEL_URL)
    : undefined) ??
  "http://localhost:4321";

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
