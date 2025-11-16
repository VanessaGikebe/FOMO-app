module.exports = {
  testEnvironment: "jsdom",
  transform: {
    // Use next/jest for transforming test files
    "^.+\\.(js|jsx|ts|tsx)$": ["next/jest", { "configFile": "./next.config.mjs" }]
  },
  moduleNameMapper: {
    // Support Next.js-style imports like "@/components"
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
