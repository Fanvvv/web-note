const { resolve } = require("path");
const { merge } = require("webpack-merge");

const baseConfig = {
  mode: "development",
  target: "web",
  devtool: false,
  entry: {
    main: { import: "./src/index.js" },
  },
  output: {
    clean: true,
    path: resolve(__dirname, "dist"),
  },
};

module.exports = [
  merge(baseConfig, { target: "web", output: { filename: "target-web.js" } }),
  merge(baseConfig, { target: "node", output: { filename: "target-node.js" } }),
]
