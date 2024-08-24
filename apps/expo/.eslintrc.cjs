/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["../../.eslintrc.cjs", "expo"],
  root: true,
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "react/jsx-sort-props": "error",
  },
};

module.exports = config;
