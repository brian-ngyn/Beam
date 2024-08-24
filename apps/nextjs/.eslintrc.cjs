/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../../.eslintrc.cjs", "next"],
  root: true,
  rules: {
    "react/display-name": "off",
    "react/jsx-sort-props": "error",
    "react/no-unknown-property": "error",
    "react/sort-comp": 0,
  },
};
