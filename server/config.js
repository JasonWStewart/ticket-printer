module.exports = {
  api: {
    port: process.env.PORT || 3000,
    prefix: "/api",
    key: "secret",
  },
  dev: {
    printerlessMode: false,
  },
};
