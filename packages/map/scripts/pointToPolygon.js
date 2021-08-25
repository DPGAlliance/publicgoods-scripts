const turf = require("@turf/circle");
const turfRotate = require("@turf/transform-rotate");
const fs = require("fs");

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const csvFilePath = "public/countries_codes_and_coordinates.csv";
const csv = require("csvtojson");

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    ["deployments", "developments"].map((desc, i) => {
      var arr = [];
      arr = jsonObj.map(
        ({
          Country,
          "Alpha-3": alpha3,
          "Latitude (average)": lat,
          "Longitude (average)": lon,
        }) => {
          return {
            country: Country,
            iso: alpha3,
            center: [parseFloat(lon) + 0.3 * i, parseFloat(lat)],
          };
        }
      );
      var result = arr.map((el, i) =>
        turfRotate(
          turf.default(
            el.center,
            10,
            (options = {
              steps: 4,
              units: "kilometers",
              properties: {country: el.country, iso: el.iso, layer: desc},
            })
          ),
          45
        )
      );
      storeData(
        {
          features: result,
          type: "FeatureCollection",
        },
        `public/polygons-${desc}.geojson`
      );
    });
  });
