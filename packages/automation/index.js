const fs = require("fs");
const glob = require("glob");
const replace = require("replace-in-file");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const fspromise = require("fs/promises");
let dpgs = [];
try {
  dpgs = JSON.parse(fs.readFileSync("../registry/src/nominees.json", "utf8"));
} catch (err) {
  console.error(err);
}

//console.log(dpgs[2])
const SDGS = [
  "SDG1: End Poverty in all its forms everywhere",
  "SDG2: Zero Hunger",
  "SDG3: Good Health and Well-Being",
  "SDG4: Quality Education",
  "SDG5: Gender Equity",
  "SDG6: Clean Water and Sanitation",
  "SDG7: Affordable and Clean Energy",
  "SDG8: Decent Work and Economic Growth",
  "SDG9: Industry, Innovation and Infrastructure",
  "SDG10: Reduced Inequality",
  "SDG11: Sustainable Cities and Communities",
  "SDG12: Responsible Consumption and Production",
  "SDG13: Climate Action",
  "SDG14: Life Below Water",
  "SDG15: Life on Land",
  "SDG16: Peace and Justice Strong Institutions",
  "SDG17: Partnerships to achieve the Goal",
];

const sdgColors = [
  "#E5243B",
  "#DDA63A",
  "#4C9F38",
  "#C5192D",
  "#FF3A21",
  "#26BDE2",
  "#FCC30B",
  "#A21942",
  "#FD6925",
  "#DD1367",
  "#FD9D24",
  "#BF8B2E",
  "#3F7E44",
  "#0A97D9",
  "#56C02B",
  "#00689D",
  "#19486A",
];

path = "../registry/src/nominees.json";

pathHtml = "../../../publicgoods-website-test/registry/index.html";
destHtml = "../registry/public/index.html";
pathRegistryTemplateHtml = "./registry_template.html";

pathFormHtml = "../../../publicgoods-website-test/eligibility/index.html";
destFormHtml = "../eligibility/public/index.html";

pathMapHtml = "../../../publicgoods-website-test/map/index.html";
destMapHtml = "../map/public/";

pathRoadmapHtml = "../../../publicgoods-website-test/roadmap/index.html";
destRoadmapHtml = "../roadmap/public/index.html";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let candidates = [...dpgs];

let combos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// Initialize SDG array to count occurences in candidates
let sdgs = new Array(17).fill(0);
// Initialize type array to count occurences in candidates
const TYPE1 = "Open Software";
const TYPE2 = "Open Data";
const TYPE3 = "Open Standard";
const TYPE4 = "Open Content";
let types = {};
types[TYPE1] = 0;
types[TYPE2] = 0;
types[TYPE3] = 0;
types[TYPE4] = 0;
let vettedDPGs = 0;

// Iterate over candidates, and over each nested array and count
candidates.forEach(function (e) {
  if (e["sdgs"]) {
    e["sdgs"]['sdg'].forEach(function (d) {
      let goalString = SDGS.find((goal,index)=>goal.includes(d.substring(3,5)))
      let sdgNumber = SDGS.indexOf(goalString);

      sdgs[sdgNumber]++;
    });
    if (e["categories"]) {
      e["categories"].forEach(function (d) {
        if (types.hasOwnProperty(d)) {
          types[d]++;
        } else {
          types[d] = 0;
        }
      });

      if (
        e["categories"].includes(TYPE1) &&
        !e["categories"].includes(TYPE2) &&
        !e["categories"].includes(TYPE3) &&
        !e["categories"].includes(TYPE4)
      ) {
        combos[0]++;
      } else if (
        !e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        !e["categories"].includes(TYPE3) &&
        !e["categories"].includes(TYPE4)
      ) {
        combos[1]++;
      } else if (
        !e["categories"].includes(TYPE1) &&
        !e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        !e["categories"].includes(TYPE4)
      ) {
        combos[2]++;
      } else if (
        e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        !e["categories"].includes(TYPE3) &&
        !e["categories"].includes(TYPE4)
      ) {
        combos[3]++;
      } else if (
        e["categories"].includes(TYPE1) &&
        !e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        !e["categories"].includes(TYPE4)
      ) {
        combos[4]++;
      } else if (
        !e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        !e["categories"].includes(TYPE4)
      ) {
        combos[5]++;
      } else if (
        e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        !e["categories"].includes(TYPE4)
      ) {
        combos[6]++;
      } else if (
        e["categories"].includes(TYPE1) &&
        !e["categories"].includes(TYPE2) &&
        !e["categories"].includes(TYPE3) &&
        e["categories"].includes(TYPE4)
      ) {
        combos[7]++;
      } else if (
        !e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        !e["categories"].includes(TYPE3) &&
        e["categories"].includes(TYPE4)
      ) {
        combos[8]++;
      } else if (
        !e["categories"].includes(TYPE1) &&
        !e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        e["categories"].includes(TYPE4)
      ) {
        combos[9]++;
      } else if (
        e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        !e["categories"].includes(TYPE3) &&
        e["categories"].includes(TYPE4)
      ) {
        combos[10]++;
      } else if (
        e["categories"].includes(TYPE1) &&
        !e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        e["categories"].includes(TYPE4)
      ) {
        combos[11]++;
      } else if (
        !e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        e["categories"].includes(TYPE4)
      ) {
        combos[12]++;
      } else if (
        e["categories"].includes(TYPE1) &&
        e["categories"].includes(TYPE2) &&
        e["categories"].includes(TYPE3) &&
        e["categories"].includes(TYPE4)
      ) {
        combos[13]++;
      }
    }
    if (e["stage"] == "DPG") {
      vettedDPGs++;
    }
  }
});

// Prepare data for chart
let sdgData = { name: "sdgs", children: [] };
for (let i = 0; i < sdgs.length; i++) {
  if (sdgs[i]) {
    sdgData["children"].push({ name: i + 1, value: sdgs[i] });
  }
}

var sets = [
  { sets: [1], size: types[TYPE1], value: types[TYPE1], label: TYPE1 },
  { sets: [2], size: types[TYPE2], value: types[TYPE2], label: TYPE2 },
  { sets: [3], size: types[TYPE3], value: types[TYPE3], label: TYPE3 },
  { sets: [4], size: types[TYPE4], value: types[TYPE4], label: TYPE4 },
  { sets: [1, 2], size: combos[3], value: combos[3] },
  { sets: [1, 3], size: combos[4], value: combos[4] },
  { sets: [1, 4], size: combos[7], value: combos[7] },
  { sets: [2, 3], size: combos[5], value: combos[5] },
  { sets: [2, 4], size: combos[8], value: combos[8] },
  { sets: [3, 4], size: combos[9], value: combos[9] },
  { sets: [1, 2, 3], size: combos[6], value: combos[6] },
  { sets: [1, 2, 4], size: combos[10], value: combos[10] },
  { sets: [1, 3, 4], size: combos[11], value: combos[11] },
  { sets: [2, 3, 4], size: combos[12], value: combos[12] },
  { sets: [1, 2, 3, 4], size: combos[13], value: combos[13] },
];

// Add total for types to get percentages below
let t = 0;
for (var key in types) {
  t += types[key];
}

// Compute type as percetage
let type = {};
for (var key in types) {
  type[key] = Math.round((types[key] / t) * 100);
}

let typeData = [];
for (var key in types) {
  typeData.push({ name: key, value: Math.round((types[key] / t) * 100) });
}

fs.readFile(pathRegistryTemplateHtml, 'utf-8', (err, data) => {
  if (err) {
    return console.error("Error occurred:", err);
  }
  let htmlOutput = data
    .replace('$vettedDPGs$', vettedDPGs)
    .replace('$sdgData$', JSON.stringify(sdgData))
    .replace('$typeData$', JSON.stringify(typeData))
    .replace('$SDGS$', JSON.stringify(SDGS))
    .replace('$sdgColors$', JSON.stringify(sdgColors))
    .replace('$sets$', JSON.stringify(sets));

  replace(
    { 
      files: pathHtml, 
      from: "<p>Placeholder</p>", 
      to: htmlOutput 
    },
    (error, changedFiles) => {
      if (error) {
        return console.error("Error occurred:", error);
      }
      console.log("Modified files:", changedFiles.join(", "));
  
      replace(
        {
          files: pathHtml,
          from: 'class="col-md-8 page-content-wrap  col-md-offset-2"',
          to: 'class="col-lg-12 page-content-wrap"',
        },
        (error, changedFiles) => {
          if (error) {
            return console.error("Error occurred:", error);
          }
          console.log("Modified files:", changedFiles.join(", "));
  
          replace(
            {
              files: pathHtml, 
              from: "</body>", 
              to: `
                <script type="text/javascript" src="./ResizeSensor.js"></script>
                <script type='text/javascript' src="./sticky-sidebar.min.js"></script>
            
                <script type='text/javascript'>
                  var sidebar = new StickySidebar('#sidebar', {
                      containerSelector: '#main-content',
                      innerWrapperSelector: '.sidebar__inner',
                      topSpacing: 60,
                      bottomSpacing: 0,
                  });
                </script>
                </body>
              ` 
            },
            (error, changedFiles) => {
              if (error) {
                return console.error("Error occurred:", error);
              }
  
              fs.copyFileSync(pathHtml, destHtml);
            }
          );
        }
      );
    }
  );
});

let formHtmlOutput = '<div id="form-content"> </div>';

replace(
  { 
    files: pathFormHtml, 
    from: "<p>Placeholder</p>", 
    to: formHtmlOutput 
  },
  (error, changedFiles) => {
    if (error) {
      return console.error("Error occurred:", error);
    }
    console.log("Modified files:", changedFiles.join(", "));
    fs.copyFileSync(pathFormHtml, destFormHtml);
  }
);

replace(
  { 
    files: pathRoadmapHtml, 
    from: "<p>Placeholder</p>", 
    to: formHtmlOutput 
  },
  (error, changedFiles) => {
    if (error) {
      return console.error("Error occurred:", error);
    }
    console.log("Modified files:", changedFiles.join(", "));
    fs.copyFileSync(pathRoadmapHtml, destRoadmapHtml);
  }
);

fs.readFile(pathMapHtml, "utf8", function (err, html) {
  if (err) {
    return console.error("Error occurred:", err);
  }
  let $ = cheerio.load(html);
  $("main").remove(); // removes element where map will be placed
  fs.writeFileSync(destMapHtml + "head.html", $("head").html());
  fs.writeFileSync(destMapHtml + "footer.html", $("footer").html());
  fs.writeFileSync(
    destMapHtml + "scripts.html",
    $.html($("#dpga-libs-js")) + $.html($("#dpga-main-js"))
  ); // finds specific dpga scripts.
  fs.writeFileSync(destMapHtml + "navbar.html", $("#page").html());
  fs.writeFileSync(
    destMapHtml + "templateClassName.txt",
    $("body").attr("class")
  );
});
