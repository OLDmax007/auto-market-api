import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import importSortPlugin from "eslint-plugin-simple-import-sort";

export default [
    {
        files: ["**/*.ts"],
        ignores: ["eslint.config.js", "dist/**"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: process.cwd(),
            },
            globals: {
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                console: "readonly",
                setTimeout: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            prettier: prettierPlugin,
            import: importPlugin,
            "simple-import-sort": importSortPlugin,
        },
        rules: {
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "req|res|next" }],
            "@typescript-eslint/return-await": ["error", "in-try-catch"],

            "import/first": "error",
            "import/newline-after-import": ["error", { count: 1 }],
            "import/no-duplicates": "error",

            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            "prettier/prettier": ["error"],

            "no-console": "warn",
        },
    },
];
