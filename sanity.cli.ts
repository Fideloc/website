import { defineCliConfig } from "sanity/cli";

// Sanity CLI loads this file in a TS context that doesn't auto-inherit
// `.env` values, so we explicitly load them here.
try {
  process.loadEnvFile(".env");
} catch {
  // Either the file doesn't exist (CI) or this Node version is too old; both
  // are fine — env vars from the parent shell will still be picked up below.
}

export default defineCliConfig({
  api: {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.PUBLIC_SANITY_DATASET ?? "",
  },
  typegen: {
    path: "./src/lib/**/*.{ts,tsx,js,jsx}",
    schema: "./schema.json",
    generates: "./src/lib/sanity.types.ts",
    overloadClientMethods: true,
  },
});
