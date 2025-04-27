const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: false, // Don't delete existing files before compilation
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
  },
  experiments: {
    backCompat: false, // Fix ObjectMiddleware warning
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            pure_funcs: ["console.log"], // Remove console logs
          },
          format: {
            comments: false, // Remove comments
          },
        },
        extractComments: false,
        parallel: true, // Fix Terser warning
        exclude: /node_modules/,
      }),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxInitialRequests: 10,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          enforce: true,
          priority: -10,
        },
      },
    },
  },
  externals: {
    terser: "commonjs terser",
    "uglify-js": "commonjs uglify-js",
    "@swc/core": "commonjs @swc/core",
    esbuild: "commonjs esbuild",
    pnpapi: "commonjs pnpapi",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled", // Disable analyzer to avoid missing file errors
    }),
    new webpack.ProvidePlugin({
      process: "process/browser", // Fix process not defined issue
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.node$/,
        loader: "node-loader",
      },
      {
        test: /\.d\.ts$/,
        loader: "ignore-loader",
      },
    ],
  },
  resolve: {
    fallback: {
      process: require.resolve("process/browser"),
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      querystring: require.resolve("querystring-es3"),
      url: require.resolve("url/"),
      assert: require.resolve("assert/"),
      zlib: require.resolve("browserify-zlib"),
      os: require.resolve("os-browserify/browser"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      path: require.resolve("path-browserify"),
      tty: require.resolve("tty-browserify"),
      fs: false,
      child_process: false,
      worker_threads: false,
      module: false,
      inspector: false,
      vm: false,
      constants: false,
    },
  },
  ignoreWarnings: [
    {
      module: /@swc\/core|terser-webpack-plugin|esbuild|jest-worker|loader-runner/,
      message: /the request of a dependency is an expression/,
    },
  ],
};