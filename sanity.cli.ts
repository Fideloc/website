import { defineCliConfig } from "sanity/cli";

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
