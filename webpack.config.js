var webpack = require("webpack");
var path = require("path");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    "docs.js": "./docs/index.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name]"
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.md$/,
        use: {
          loader: "html!markdown"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@casinoflex/react-slick": path.resolve(__dirname, "src/index.js")
    }
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /vertx/ })],
  devServer: {
    contentBase: path.join(__dirname, "./build"),
    port: 8080,
    hot: true
  }
};
