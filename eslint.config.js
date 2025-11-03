/** @type {import('eslint').Linter.Config} */
const config = [
  {
    ignores: [".next/**", "out/**", "build/**", "dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Add your custom ESLint rules here if needed
    },
    settings: {
      // ESLint settings can be configured here
    },
  },
];

export default config;
