const withCSS = require("@zeit/next-css");
const withImages = require("next-images");

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
    assetPrefix: "map/" //for github integration in publicgoods-website TODO: write additional code in movefiles.bash and auto.yml 
  })
);
