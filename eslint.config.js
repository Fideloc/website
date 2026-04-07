import { createRequire } from "node:module";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tsParser from "@typescript-eslint/parser";
import requireStegaClean from "./eslint-rules/require-stega-clean.js";

// astro-eslint-parser is a transitive dep of eslint-plugin-astro and ships
// without an "exports" field, so resolve it via CJS require to avoid having
// to add it as a direct dependency.
const requireCjs = createRequire(import.meta.url);
const astroParser = requireCjs("astro-eslint-parser");

const sanityStegaPlugin = {
  rules: {
    "require-stega-clean": requireStegaClean,
  },
};

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Re-declare the .astro parser to attach typed parser services so the
    // require-stega-clean rule can query the TS type checker.
    // astro-eslint-parser doesn't support `projectService`, so use `project`.
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.astro", "**/*.tsx"],
    plugins: {
      "sanity-stega": sanityStegaPlugin,
    },
    rules: {
      "sanity-stega/require-stega-clean": "error",
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
];
