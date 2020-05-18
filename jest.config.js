module.exports = {
  rootDir: __dirname,
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testMatch: ["<rootDir>/**/__tests__/**/*spec.ts", "<rootDir>/tests/**/*spec.ts"],
  moduleFileExtensions: ["js", "ts", "tsx"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  collectCoverageFrom: ["src/*.{js,ts}", "src/**/*.{js,ts}"],
};
