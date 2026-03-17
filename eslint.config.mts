// Note: This ESLint flat config is stored as `.mts`. Ensure a TS loader (e.g., `jiti`)
// is installed and available so ESLint can load this file when running `eslint .`.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";

const codeFiles = ["**/*.{js,mjs,cjs,ts,mts,cts}"];

export default [
  { ignores: ["package-lock.json"] },
  { ...js.configs.recommended, files: codeFiles },
  ...tseslint.configs.recommended.map(config => ({ ...config, files: codeFiles })),
  { files: codeFiles, languageOptions: { globals: {...globals.browser, ...globals.node} } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.json"], ...json.configs.recommended, language: "json/json" },
  { files: ["**/*.jsonc"], ...json.configs.recommended, language: "json/jsonc" },
  { files: ["**/*.json5"], ...json.configs.recommended, language: "json/json5" },
  ...markdown.configs.recommended,
  { files: ["**/*.css"], ...css.configs.recommended, language: "css/css" },
];
