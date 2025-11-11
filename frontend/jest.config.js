module.exports = {
  testEnvironment: "jsdom",
   transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    // Support Next.js-style imports like "@/components"
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
