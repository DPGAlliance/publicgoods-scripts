import dynamic from "next/dynamic";
import React from "react";
import {promises as fs} from "fs";
import path from "path";

export default function Home(props) {
  const MapComponent = dynamic(import("../components/mapComponent"), {
    ssr: false,
  });
  return (
    <div className="main">
      <MapComponent
        lon={6}
        lat={24.5}
        countries={props.data.countries}
        pathfinderExploratory={props.data.pathfinders.exploratory}
        pathfinderConfirmed={props.data.pathfinders.confirmed}
        digitalGoods={props.data.digitalGoods}
        story={props.data.story}
        devPolygons={props.data.polygons[1]}
        depPolygons={props.data.polygons[0]}
      />
    </div>
  );
}

export async function getStaticProps() {
  const convertArrayToObject = (array, key) =>
    array.reduce((acc, curr) => ((acc[curr[key]] = curr), acc), {});
  const csv = require("csvtojson");
  const nodefetch = require("node-fetch");
  const csvFilePath = path.join(
    process.cwd(),
    "public/countries_codes_and_coordinates.csv"
  );
  const loadAlpha = await csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      return convertArrayToObject(jsonObj, "Country");
    });
  var perPage = 100;
  const range = (start, stop, step) =>
    Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);
  const fetchData = async () => {
    const alpha3 = {...loadAlpha};
    var countries = {};
    var mismatched = {};
    const handleCountries = (data) => {
      let deployGoods = {};
      let developmentGoods = {};
      let c = countries;

      ["deploymentCountries", "developmentCountries"].map((el) => {
        data.locations[el].map((country) => {
          if (!alpha3[country]) {
            // console.log("Mismatched good " + country);
            mismatched[country] = country + ` ${el} ` + data.name;
          } else {
            if (!Object.keys(c).find((e) => e == alpha3[country]["Alpha-3"])) {
              c[alpha3[country]["Alpha-3"]] = {};
            }
            let code = alpha3[country]["Alpha-3"];
            el == "deploymentCountries"
              ? (deployGoods[code] = country)
              : (developmentGoods[code] = country);
            c[code]["name"] = country;
            c[code]["code"] = code;
            c[code]["lat"] = alpha3[country]["Latitude (average)"];
            c[code]["lon"] = alpha3[country]["Longitude (average)"];
          }
        });
      });
      data.locations.deploymentCountries = deployGoods;
      data.locations.developmentCountries = developmentGoods;

      countries = c;
      return data;
    };

    const result = (page) =>
      fetch(
        `https://api.github.com/search/code?q=repo:unicef/publicgoods-candidates+path:digitalpublicgoods+filename:.json&per_page=${perPage}&page=${page}`
      ).then((response) => response.json());

    const gitSearchRes = await result(1);
    // get number of pages we need to fetch
    const pageNumbers = Math.ceil(gitSearchRes.total_count / perPage);
    // fetch and add all items to array from publicgoods-candidates
    const goodsFileNames = await (
      await Promise.all(range(1, pageNumbers, 1).map(async (page) => await result(page)))
    ).reduce((res, v) => res.concat(v.items), []);

    const digitalGoodsData = await goodsFileNames.map(async (filename) => {
      const res = await fetch(
        "https://raw.githubusercontent.com/unicef/publicgoods-candidates/master/digitalpublicgoods/" +
          filename.name
      );
      const fileContents = await res.text();
      const nomineeRes = await fetch(
        "https://raw.githubusercontent.com/unicef/publicgoods-candidates/master/nominees/" +
          filename.name
      );
      const nomineeFileContents = await nomineeRes.text();
      try {
        let goodsData = JSON.parse(fileContents);

        let nomineeData = JSON.parse(nomineeFileContents);
        return {...handleCountries(goodsData), ...nomineeData};
      } catch (error) {
        // handle linked json
        const res = await fetch(
          "https://raw.githubusercontent.com/unicef/publicgoods-candidates/master/digitalpublicgoods/" +
            fileContents
        );
        const nestedFileContent = await res.text();
        const nnomineeRes = await fetch(
          "https://raw.githubusercontent.com/unicef/publicgoods-candidates/master/nominees/" +
            filename.name
        );
        const nestedNomineeFileContents = await nnomineeRes.text();
        let ngoodsData = JSON.parse(nestedFileContent);
        ngoodsData.name = filename.name.replace(".json", "");
        let nnomineeData = JSON.parse(nestedNomineeFileContents);
        return {...handleCountries(ngoodsData), ...nnomineeData};
      }
    });

    var digitalGoodsArr = await Promise.all(digitalGoodsData);
    const addStory = (results) => {
      // replace all //n //r, FALSE
      for (let i = 0; i < results.length; i++) {
        if (results[i].text) {
          results[i].text = results[i].text.replace(/[\r\n]+/gm, " ");
        }
        if (results[i].image) {
          results[i].image = results[i].image.replace("FALSE", false);
          results[i].image = results[i].image.replace("TRUE", true);
        }
      }
      return results;
    };
    const loadGsheet = async (sheetId, sheetGidNumber) => {
      let sheetResponse = await nodefetch(
        `https://docs.google.com/spreadsheets/u/1/d/${sheetId}/export?format=csv&id=${sheetId}&gid=${sheetGidNumber}`
      );
      let resultText = await sheetResponse.text();
      return await csv().fromString(resultText);
    };
    const storyData = addStory(
      await loadGsheet(process.env.NEXT_PUBLIC_SHEET_ID, 728344896)
    );

    const addCountries = async (results, label) => {
      let s = {};
      let l = {};
      let c = countries;
      results.map((el, i) => {
        let country = el.Country;
        if (!alpha3[country]) {
          console.log("Mismatched " + country);
          mismatched[country] = country + " " + label;
        } else {
          if (!Object.keys(c).find((e) => e == alpha3[country]["Alpha-3"])) {
            c[alpha3[country]["Alpha-3"]] = {};
          }
          let code = alpha3[country]["Alpha-3"];
          c[code][label] = el;
          c[code]["name"] = country;
          c[code]["code"] = code;
          c[code]["lat"] = alpha3[country]["Latitude (average)"];
          c[code]["lon"] = alpha3[country]["Longitude (average)"];
          el.Status == "Confirmed" ? (s[code] = el) : (l[code] = el);
        }
      });
      countries = c;
      return {confirmed: s, exploratory: l};
    };
    const pathfinderData = await loadGsheet(process.env.NEXT_PUBLIC_SHEET_ID, 635692465);
    const pathfinders = await addCountries(pathfinderData, "pathfinder");

    const polygonsDirectory = path.join(process.cwd(), "public");
    const filenames = await fs.readdir(polygonsDirectory);
    const polygons = filenames
      .filter((el) =>
        ["polygons-deployments.geojson", "polygons-developments.geojson"].includes(el)
      )
      .map(async (filename, index) => {
        const filePath = path.join(polygonsDirectory, filename);
        const fileContents = await fs.readFile(filePath, "utf8");
        const polygon = JSON.parse(fileContents);
        let arrayOfCountries =
          index == 0 ? "deploymentCountries" : "developmentCountries";
        polygon["features"].map((el) => {
          el.properties["text-field"] = digitalGoodsArr
            .filter((good) =>
              Object.keys(good.locations[arrayOfCountries]).includes(el.properties.iso)
            )
            .length.toString();
          el.properties["height"] = parseFloat(el.properties["text-field"]) * 20000;
          el.properties["base"] = el.properties["height"] == 0 ? 999999999999 : 0;
          el.properties["height"] += el.properties["height"] == 0 ? 999999999999 : 0;
        });
        return polygon;
      });
    console.log("missmathes", mismatched);

    return {
      countries: countries,
      digitalGoods: digitalGoodsArr,
      pathfinders: pathfinders,
      polygons: await Promise.all(polygons),
      story: storyData,
    };
  };
  return {
    props: {
      data: await fetchData(),
    },
    revalidate: 60,
  };
}
