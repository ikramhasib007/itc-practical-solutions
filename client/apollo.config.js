module.exports = {
  client: {
    service: {
      name: 'api-engine-v1',
      url: 'http://localhost:4001/graphql',
    },
    includes: ["./src/**/*.{ts,js,tsx}"],
  }
};
