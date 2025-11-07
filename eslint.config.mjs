import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import eslintPluginUnicorn from "eslint-plugin-unicorn";



export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  eslintPluginUnicorn.configs.all,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "next.config.ts",
    "package-lock.json",
    ".cache/**",
    "components/ui/**",
  ]),
]);
