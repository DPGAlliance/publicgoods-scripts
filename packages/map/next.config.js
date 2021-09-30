const withCSS = require("@zeit/next-css");
const withImages = require("next-images");
const debug = process.env.NODE_ENV !== "production";

module.exports = withCSS(
  withImages({
    webpack(config) {
      config.module.rules.push({
        test: /\.geojson$/,
        use: ["json-loader"],
      });

      return config;
    },
    cssLoaderOptions: {
      url: false,
    },
    assetPrefix: !debug ? "./" : "", //add prefix for github integration in publicgoods-website
    webpack5: false,
    images: {
      domains: ['s3.amazonaws.com'],
    },
  })
);
