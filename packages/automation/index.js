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

let combos = new Array(26).fill(0);
// Initialize SDG array to count occurences in candidates
let sdgs = new Array(17).fill(0);
// Initialize type array to count occurences in candidates
const CSoftware = "Open Software";
const CData = "Open Data";
const CStandard = "Open Standard";
const CContent = "Open Content";
const CAIModel = "Open AI Model";
let types = {};
types[CSoftware] = 0;
types[CData] = 0;
types[CStandard] = 0;
types[CContent] = 0;
types[CAIModel] = 0;
let vettedDPGs = 0;

// Iterate over candidates, and over each nested array and count
candidates.forEach(function (e) {
    if (e["sdgs"]) {
        e["sdgs"]['sdg'].forEach(function (d) {
            let goalString = SDGS.find((goal, index) => goal.includes(d.substring(3, 5)))
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
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[0]++; // 1, 2
            } else if (
                e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[1]++; // 1, 3
            } else if (
                e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[2]++; // 1, 4
            } else if (
                e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[3]++; // 1, 5
            } else if (
                !e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[4]++; // 2, 3
            } else if (
                !e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[5]++; // 2, 4
            } else if (
                !e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[6]++; // 2, 5
            } else if (
                !e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[7]++; // 3, 4
            } else if (
                !e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[8]++; // 3, 5
            } else if (
                !e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[9]++; // 4, 5
            } else if (
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[10]++; // 1, 2, 3
            } else if (
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[11]++; // 1, 2, 4
            } else if (
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[12]++; // 1, 2, 5
            } else if (
                e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[13]++; // 1, 3, 4
            } else if (
                e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[14]++; // 1, 3, 5
            } else if (
                e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[15]++; // 1, 4, 5
            } else if (
                !e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[16]++; // 2, 3, 4
            } else if (
                !e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[17]++; // 2, 3, 5
            } else if (
                !e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[18]++; // 2, 4, 5
            } else if (
                !e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[19]++; // 3, 4, 5
            } else if (
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                !e["categories"].includes(CAIModel)
            ) {
                combos[20]++; // 1, 2, 3, 4
            } else if (
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                !e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[21]++; // 1, 2, 3, 5
            } else if (
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                !e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[22]++; // 1, 2, 4, 5
            } else if (
                e["categories"].includes(CSoftware) &&
                !e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[23]++; // 1, 3, 4, 5
            } else if (
                !e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[24]++; // 2, 3, 4, 5
            } else if (
                e["categories"].includes(CSoftware) &&
                e["categories"].includes(CData) &&
                e["categories"].includes(CStandard) &&
                e["categories"].includes(CContent) &&
                e["categories"].includes(CAIModel)
            ) {
                combos[25]++; // 1, 2, 3, 4, 5
            }
        }
        if (e["stage"] == "DPG") {
            vettedDPGs++;
        }
    }
});

// Prepare data for chart
let sdgData = {name: "sdgs", children: []};
for (let i = 0; i < sdgs.length; i++) {
    if (sdgs[i]) {
        sdgData["children"].push({name: i + 1, value: sdgs[i]});
    }
}

const sets = [
    {sets: [1], size: types[CSoftware], value: types[CSoftware], label: CSoftware},
    {sets: [2], size: types[CData], value: types[CData], label: CData},
    {sets: [3], size: types[CStandard], value: types[CStandard], label: CStandard},
    {sets: [4], size: types[CContent], value: types[CContent], label: CContent},
    {sets: [5], size: types[CAIModel], value: types[CAIModel], label: CAIModel},

    {sets: [1, 2], size: combos[0], value: combos[0]},
    {sets: [1, 3], size: combos[1], value: combos[1]},
    {sets: [1, 4], size: combos[2], value: combos[2]},
    {sets: [1, 5], size: combos[3], value: combos[3]},
    {sets: [2, 3], size: combos[4], value: combos[4]},
    {sets: [2, 4], size: combos[5], value: combos[5]},
    {sets: [2, 5], size: combos[6], value: combos[6]},
    {sets: [3, 4], size: combos[7], value: combos[7]},
    {sets: [3, 5], size: combos[8], value: combos[8]},
    {sets: [4, 5], size: combos[9], value: combos[9]},

    {sets: [1, 2, 3], size: combos[10], value: combos[10]},
    {sets: [1, 2, 4], size: combos[11], value: combos[11]},
    {sets: [1, 2, 5], size: combos[12], value: combos[12]},
    {sets: [1, 3, 4], size: combos[13], value: combos[13]},
    {sets: [1, 3, 5], size: combos[14], value: combos[14]},
    {sets: [1, 4, 5], size: combos[15], value: combos[15]},
    {sets: [2, 3, 4], size: combos[16], value: combos[16]},
    {sets: [2, 3, 5], size: combos[17], value: combos[17]},
    {sets: [2, 4, 5], size: combos[18], value: combos[18]},
    {sets: [3, 4, 5], size: combos[19], value: combos[19]},

    {sets: [1, 2, 3, 4], size: combos[20], value: combos[20]},
    {sets: [1, 2, 3, 5], size: combos[21], value: combos[21]},
    {sets: [1, 2, 4, 5], size: combos[22], value: combos[22]},
    {sets: [1, 3, 4, 5], size: combos[23], value: combos[23]},
    {sets: [2, 3, 4, 5], size: combos[24], value: combos[24]},

    {sets: [1, 2, 3, 4, 5], size: combos[25], value: combos[25]},
];

// Add total for types to get percentages below
let t = 0;
for (const key in types) {
    t += types[key];
}

// Compute type as percetage
let type = {};
for (const key in types) {
    type[key] = Math.round((types[key] / t) * 100);
}

let typeData = [];
for (const key in types) {
    typeData.push({name: key, value: Math.round((types[key] / t) * 100)});
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

                    fs.copyFileSync(pathHtml, destHtml);
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
