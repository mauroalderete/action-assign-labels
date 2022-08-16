const config = {
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coverageThreshold: {
    global: {
      lines: 95,
    },
  },
};

module.exports = config;
