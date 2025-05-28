module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier", // Add this to disable ESLint rules that conflict with Prettier
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "import"],
  rules: {
    // Disable rules that conflict with Prettier
    "prettier/prettier": "error",

    // Prevent unescaped line breaks in strings
    "no-multi-str": "error",
    "no-template-curly-in-string": "error",

    // React rules
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
    "react/prop-types": "off", // Using TypeScript for prop validation
    "react/display-name": "off",

    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    // Import rules
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/no-unresolved": "off", // TypeScript handles this

    // General rules
    "no-console": "warn",
    "no-debugger": "error",
    quotes: ["error", "double", { avoidEscape: true }],

    // Accessibility rules
    "jsx-a11y/anchor-is-valid": "off", // Next.js Link component handles this

    // String literals
    "no-useless-concat": "warn",

    // Prevent console logs in production
    //"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",

    // Enforce consistent quotes
    //quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: false }],

    // Enforce semicolons
    semi: ["error", "never"],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: ["node_modules/", ".next/", "out/", "public/", "**/*.d.ts"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        // TypeScript-specific rules
      },
    },
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
}
