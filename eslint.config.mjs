import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";

const codeFiles = ["**/*.{js,mjs,cjs,ts,mts,cts}"];

export default [
  { ...js.configs.recommended, files: codeFiles },
  ...tseslint.configs.recommended.map(config => ({ ...config, files: codeFiles })),
  { files: codeFiles, languageOptions: { globals: {...globals.browser, ...globals.node} } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.json"], language: "json/json", ...json.configs.recommended },
  { files: ["**/*.jsonc"], language: "json/jsonc", ...json.configs.recommended },
  { files: ["**/*.json5"], language: "json/json5", ...json.configs.recommended },
  ...markdown.configs.recommended,
  { files: ["**/*.css"], language: "css/css", ...css.configs.recommended },
];
