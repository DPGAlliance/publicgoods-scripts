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
        SDGs={props.data.SDGs}
        summary={props.data.summary}
      />
    </div>
  );
}

export async function getStaticProps() {
  const renameCountry = {
    "Antigua & Barbuda": "Antigua and Barbuda",
    "Antigua And Barbuda": "Antigua and Barbuda",
    "Bolivia (Plurinational State of)": "Bolivia",
    "Bolivia, Plurinational State of": "Bolivia",
    Bosnia: "Bosnia and Herzegovina",
    "Bosnia & Herzegovina": "Bosnia and Herzegovina",
    "Bosnia And Herzegowina": "Bosnia and Herzegovina",
    Bravil: "Brazil",
    "Brunei Darussalam": "Brunei",
    "Cape Verde": "Cabo Verde",
    "Central African Rep.": "Central African Republic",
    Congo: "Congo (Congo-Brazzaville)",
    "Congo (the Democratic Republic of the Congo)": "Democratic Republic of the Congo",
    "Congo - Brazzaville": "Congo (Congo-Brazzaville)",
    "Congo, the Democratic Republic of the": "Democratic Republic of the Congo",
    "Cote D'Ivoire": "Côte d'Ivoire",
    "Cote d' Ivoire": "Côte d'Ivoire",
    "Cote d'Ivoire": "Côte d'Ivoire",
    "Cote d’Ivoire": "Côte d'Ivoire",
    "Czech Republic": "Czechia (Czech Republic)",
    Czechia: "Czechia (Czech Republic)",
    "Côte d’Ivoire": "Côte d'Ivoire",
    DRC: "Democratic Republic of the Congo",
    "Dem. Rep. Congo": "Democratic Republic of the Congo",
    "Democratic Republic of Congo": "Democratic Republic of the Congo",
    "East Timor": "Timor-Leste",
    Eswatini: "Eswatini (fmr. 'Swaziland')",
    "Falkland Islands": "Falkland Islands (Malvinas)",
    "Guinea Bissau": "Guinea-Bissau",
    Haita: "Haiti",
    "Holy See (Vatican City State)": "Holy See",
    "Iran (Islamic Republic Of)": "Iran",
    "Ivory Coast": "Côte d'Ivoire",
    "Ivory coast": "Côte d'Ivoire",
    Kazahkstan: "Kazakhstan",
    "Korea (the Republic of Korea)": "South Korea",
    "Korea, Democratic People's Republic of": "North Korea",
    "Korea, Republic of": "South Korea",
    Kyrgyztan: "Kyrgyzstan",
    "Lao People's Democratic Republic": "Laos",
    London: "United Kingdom",
    Luxemburg: "Luxembourg",
    Macedonia: "North Macedonia",
    "Macedonia, the Former Yugoslav Republic of": "North Macedonia",
    "Met Norway Weather has universal design and coverage, and serves all countries in the world with geospecific user-oriented data dissemination (supporting more than 12 million unique geolocations world-wide on Yr). The usage is largest in Norway and neighbouring countries but also relatively large in low- and middle-income countries. We have also written feedback from users that Yr and Met Norway Weather are being used and adapted for use in a range of low- and middle-income countries. To our understanding, Met Norway Weather removes barriers to access and usage in the availability of open, user-oriented, timely, high-quality weather forecast information. List of countries where recent requests to MET Norway Weather have originated (ordered after number of requests):":
      "",
    "Micronesia, Federated States Of": "Micronesia",
    "Micronesia, Federated States of": "Micronesia",
    "Moldova, Republic of": "Moldova",
    "Myanmar (Burma)": "Myanmar",
    Palestine: "Palestine State",
    "Palestine, State of": "Palestine State",
    "Republic of Congo": "Congo (Congo-Brazzaville)",
    "Republic of the Congo": "Congo (Congo-Brazzaville)",
    "Russian Federation": "Russia",
    "Sao Tome": "Sao Tome and Principe",
    "Sint Maarten": "Sint Maarten (Dutch part)",
    "Slovakia (Slovak Republic)": "Slovakia",
    Somaliland: "Somalia", //  Somaliland is an unrecognised sovereign state in the Horn of Africa, internationally considered[11][12] to be part of Somalia.
    "South Georgia And South S.S.": "South Georgia and the South Sandwich Islands",
    SouthAfrica: "South Africa",
    "St. Helena": "Saint Helena, Ascension and Tristan da Cunha",
    "St. Kitts & Nevis": "Saint Kitts and Nevis",
    "Saint Kitts And Nevis": "Saint Kitts and Nevis",
    "St. Lucia": "Saint Lucia",
    "St. Martin": "Saint Martin (French part)",
    "St. Pierre & Miquelon": "Saint Pierre and Miquelon",
    "St. Barthélemy": "Saint Barthélemy",
    "St. Pierre And Miquelon": "Saint Pierre and Miquelon",
    "St. Vincent & Grenadines": "Saint Vincent and the Grenadines",
    "Saint Vincent And The Grenadines": "Saint Vincent and the Grenadines",
    "State of Palestine": "Palestine State",
    Swaziland: "Eswatini (fmr. 'Swaziland')",
    "Syrian Arab Republic": "Syria",
    "São Tomé & Príncipe": "Sao Tome and Principe",
    "Sao Tome And Principe": "Sao Tome and Principe",
    "Taiwan, Province of China": "Taiwan",
    "Tanzania, United Republic of": "Tanzania",
    "The Faroe Islands": "Faroe Islands",
    "The Gambia": "Gambia",
    "Trinidad & Tobago": "Trinidad and Tobago",
    "Trinidad And Tobago": "Trinidad and Tobago",
    "Turks & Caicos Islands": "Turks and Caicos Islands",
    "Turks And Caicos Islands": "Turks and Caicos Islands",
    "U.S. Virgin Islands": "Virgin Islands, U.S.",
    UK: "United Kingdom",
    US: "United States of America",
    USA: "United States of America",
    "United Kingdom of Great Britain And Northern Ireland": "United Kingdom",
    "United Kingdom of Great Britain and Northern Ireland": "United Kingdom",
    "United Republic of Tanzania": "Tanzania",
    "United States": "United States of America",
    "Unites States": "United States of America",
    Vanuata: "Vanuatu",
    "Venezuela, Bolivarian Republic of": "Venezuela",
    "Viet Nam": "Vietnam",
    "Virgin Islands (British)": "Virgin Islands, British",
    "Virgin Islands (U.S.)": "Virgin Islands, U.S.",
    "Wallis & Futuna": "Wallis and Futuna",
    Zimbwabwe: "Zimbabwe",
    "eSwatini (former Swaziland)": "Eswatini (fmr. 'Swaziland')",
    "Bonaire, Sint Eustatius and Saba": "Caribbean Netherlands",
    "Bonaire, Sint Eustatius, and Saba": "Caribbean Netherlands",
    "British Virgin Islands": "Virgin Islands, British",
  };
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
  const maxBarHeight = 350000;
  const range = (start, stop, step) =>
    Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);
  const SDGS = [
    "No Poverty",
    "Zero Hunger",
    "Good Health and Well-being",
    "Quality Education",
    "Gender Equality",
    "Clean Water and Sanitation",
    "Affordable and Clean Energy",
    "Decent Work and Economic Growth",
    "Industry, Innovation and Infrastructure",
    "Reduced Inequality",
    "Sustainable Cities and Communities",
    "Responsible Consumption and Production",
    "Climate Action",
    "Life Below Water",
    "Life on Land",
    "Peace and Justice Strong Institutions",
    "Partnerships to achieve the Goal",
  ];
  const sdgsDefault = () => {
    let obj = {};
    for (let i = 0; i < SDGS.length; i++) {
      obj[i + 1] = {dpgs: 0, ann: SDGS[i]};
    }
    return obj;
  };
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
          country = renameCountry[country] ? renameCountry[country] : country;
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
            c[code]["search"] = "country";
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
        `https://api.github.com/search/code?q=repo:DPGAlliance/publicgoods-candidates+path:digitalpublicgoods+filename:.json&per_page=${perPage}&page=${page}`
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
        "https://raw.githubusercontent.com/DPGAlliance/publicgoods-candidates/main/digitalpublicgoods/" +
          filename.name
      );
      const fileContents = await res.text();
      const nomineeRes = await fetch(
        "https://raw.githubusercontent.com/DPGAlliance/publicgoods-candidates/main/nominees/" +
          filename.name
      );
      const nomineeFileContents = await nomineeRes.text();
      try {
        let goodsData = JSON.parse(fileContents);

        let nomineeData = JSON.parse(nomineeFileContents);
        return {...handleCountries(goodsData), ...nomineeData, search: "dpg"};
      } catch (error) {
        // handle linked json
        const res = await fetch(
          "https://raw.githubusercontent.com/DPGAlliance/publicgoods-candidates/main/digitalpublicgoods/" +
            fileContents
        );
        const nestedFileContent = await res.text();
        const nnomineeRes = await fetch(
          "https://raw.githubusercontent.com/DPGAlliance/publicgoods-candidates/main/nominees/" +
            filename.name
        );
        const nestedNomineeFileContents = await nnomineeRes.text();
        let ngoodsData = JSON.parse(nestedFileContent);
        ngoodsData.name = filename.name.replace(".json", "");
        let nnomineeData = JSON.parse(nestedNomineeFileContents);
        return {...handleCountries(ngoodsData), ...nnomineeData, search: "dpg"};
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
        let country = renameCountry[el.Country] ? renameCountry[el.Country] : el.Country;
        // let country = el.Country;
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
          c[code]["search"] = "country";
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
        let maxDpgs = Math.max(
          ...Object.values(
            digitalGoodsArr
              .reduce(
                (accum, curr) => [
                  ...accum,
                  ...Object.keys(curr.locations[arrayOfCountries]).map((el) => el),
                ],
                []
              )
              .reduce((acc, curr) => {
                return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
              }, {})
          )
        );
        polygon["features"].map((el) => {
          el.properties["text-field"] = digitalGoodsArr
            .filter((good) =>
              Object.keys(good.locations[arrayOfCountries]).includes(el.properties.iso)
            )
            .length.toString();
          el.properties["height"] =
            (parseFloat(el.properties["text-field"]) / maxDpgs) * maxBarHeight;
          el.properties["base"] = el.properties["height"] == 0 ? 999999999999 : 0;
          el.properties["height"] += el.properties["height"] == 0 ? 999999999999 : 0;
        });
        return polygon;
      });
    console.log("missmathes", mismatched);

    const SDGs = SDGS.map((sdg, sdgindex) => {
      let totalDpgs = digitalGoodsArr.filter((good) =>
        good.SDGs.some((sdg) => sdg.SDGNumber == sdgindex + 1)
      );
      let opacity = [...totalDpgs]
        .reduce((accum, curr) => {
          return [...accum, ...Object.keys(curr.locations.deploymentCountries)];
        }, [])
        .reduce((acc, curr) => {
          return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
        }, {});
      let dpgCount = [...totalDpgs]
        .reduce((accum, curr) => {
          return [...accum, ...Object.values(curr.locations.deploymentCountries)];
        }, [])
        .reduce((acc, curr) => {
          return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
        }, {});
      let maxDpgs =
        Math.max(...Object.values(opacity)) > 0 ? Math.max(...Object.values(opacity)) : 0; // avoid -Infinity
      Object.keys(opacity).map(function (key) {
        opacity[key] /= maxDpgs;
      });
      let name = "SDG " + (sdgindex + 1) + ": " + sdg;
      return {
        name: name,
        number: sdgindex + 1,
        maxDpgsInCountry: maxDpgs,
        dpgCount: Object.entries(dpgCount),
        opacity: opacity,
        totalDpgs: totalDpgs,
        search: "sdg",
      };
    });
    const sdgsSum = Object.entries(
      digitalGoodsArr
        .reduce((accum, curr) => [...accum, ...curr.SDGs.map((sdg) => sdg.SDGNumber)], [])
        .reduce(
          (acc, curr) => {
            return acc[curr] ? ++acc[curr]["dpgs"] : (acc[curr]["dpgs"] = 1), acc;
          },
          //initial value helps us create all elements of object
          {...sdgsDefault()}
        )
    );
    const typeSum = Object.entries(
      digitalGoodsArr
        .reduce((accum, curr) => [...accum, ...curr.type.map((type) => type)], [])
        .reduce(
          (acc, curr) => {
            return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
          },
          //initial value helps us create all elements of object
          {content: 0, data: 0, software: 0, standard: 0, aimodel: 0}
        )
    );
    const dpgCountrySum = [
      ...new Set(
        digitalGoodsArr.reduce((accum, curr) => {
          return [...accum, ...Object.keys(curr.locations.deploymentCountries)];
        }, [])
      ),
    ];
    return {
      countries: countries,
      digitalGoods: digitalGoodsArr,
      pathfinders: pathfinders,
      polygons: await Promise.all(polygons),
      story: storyData,
      SDGs: SDGs,
      summary: {
        sdgsSum: sdgsSum,
        typeSum: typeSum,
        dpgsum: digitalGoodsArr.length,
        dpgCountrySum: dpgCountrySum.length,
      },
    };
  };
  return {
    props: {
      data: await fetchData(),
    },
    revalidate: 60,
  };
}
