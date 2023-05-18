import React, { useEffect, useState, Fragment } from "react";
import "./style.css";

const nodefetch = require("node-fetch");
const csv = require("csvtojson");

const SHEET_ID = "1DOQ_NRcX5myEx9FWSjqszfVpJmFQVeuUvVLKHMyLZ9s";

const loadGsheet = async (sheetId, sheetGidNumber) => {
  let sheetResponse = await nodefetch(
    `https://docs.google.com/spreadsheets/u/1/d/${sheetId}/export?format=csv&id=${sheetId}&gid=${sheetGidNumber}`
  );

  let resultText = await sheetResponse.text();
  return await csv().fromString(resultText);
};

function Roadmap() {
  const [data, setData] = useState([]);
  const [searchParam] = useState(["Organization", "Activity"]);
  const [q, setQ] = useState("");
  const [filterParam, setFilterParam] = useState(["All"]);

  useEffect(() => {
    async function loadData() {
      const data = await loadGsheet(SHEET_ID, 0);
      console.log(data);
      console.log("Data loaded from GSheets");
      setData(data);
    }
    loadData();
  }, []);

  function search(items) {
    // eslint-disable-next-line
    return items.filter((item) => {
      /* 
        //             in here we check if our organization is equal to our c state
        // if it's equal to then only return the items that match
        // if not return All the organizations
        */
      // eslint-disable-next-line
      if (item.Organization == filterParam) {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
        // eslint-disable-next-line
      } else if (filterParam == "All") {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      }
    });
  }

  function truncateText(text, maxLength) {
    if (text.length +17 > maxLength ) {
      const truncatedText = `${text.substring(0, maxLength - 18)}...`;
      const truncatedLength = truncatedText.length;
      const requiredLength = maxLength-truncatedLength
      return requiredLength > 15.1 && requiredLength < 15.16 ? `${text.substring(0, truncatedLength + 10)}...` : `${text.substring(0, truncatedLength - 3)}...`;
    } else {
      return text;
    }
  }
  function renderLink(text, link, x, width) {
    if (link) {
      return (
        <tspan x={x}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            fill="#212180"
            style={{ textDecoration: "underline" }}
          >
            {truncateText(text, width)}
          </a>
          <title>{text}</title>
        </tspan>
      );
    } else {
      return (
        <tspan x={x}>
          {truncateText(text, width)}
          <title>{text}</title>
        </tspan>
      );
    }
  }

  function renderOrg(data, i, org, orgLink) {
    let rowspan = 0;
    if (i > 0 && data[i - 1].Organization === org) {
      // Do nothing because we have already covered this scenario
    } else {
      while (data[i + rowspan] && data[i + rowspan].Organization === org) {
        rowspan++;
      }
      let orgLines = org.split("\\n");
      return (
        <>
          <rect
            x="0"
            y={`${80 + 40 * (i + 1)}`}
            width="190"
            height={30 * rowspan + 10 * (rowspan - 1)}
            fill="#2AA8A8"
          />
          <text fontSize="16px" textAnchor="middle">
            {orgLines.map(function (line, l) {
              if (orgLink) {
                line = (
                  <a
                    href={orgLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fill: "white" }}
                  >
                    {line}
                  </a>
                );
              }
              return (
                <tspan
                  x="100"
                  y={`${
                    100 +
                    40 * (i + 1) +
                    20 * (rowspan - 1) +
                    20 * (l - ((orgLines.length - 1) * 1) / 2)
                  }`}
                  style={{ fill: "white" }}
                >
                  {line}
                </tspan>
              );
            })}
          </text>
        </>
      );
    }
  }

  function renderCategory(data, i, category) {
    let rowspan = 0;
    if (i > 0 && data[i - 1].Category === category) {
      // Do nothing because we have already covered this scenario
    } else {
      while (data[i + rowspan] && data[i + rowspan].Category === category) {
        rowspan++;
      }
    }
  }
  function getWidthInTextUnits(width) {
    const text = "Lorem ipsum dolor sit amet";
    const textNode = document.createElement("span");
    textNode.style.fontSize = "12px";
    textNode.style.fontFamily = "sans-serif";
    textNode.textContent = text;
    document.body.appendChild(textNode);
    const textWidth = textNode.getBoundingClientRect().width;
    document.body.removeChild(textNode);
    const ratio = textWidth / text.length;
    return width / ratio;
  }

  function renderCell(data, row, i) {
    let x, cx, width;
    if (row["1"]) {
      x = 200 + (1 - row["1"]) * 190;
      width = 190 * row["1"];
      if (row["2"]) {
        width += 10 + 190 * row["2"];
        if (row["3"]) {
          width += 10 + 190 * row["3"];
          if (row["4"]) {
            width += 10 + 190 * row["4"];
          }
        }
      }
    } else if (row["2"]) {
      x = 400 + (1 - row["2"]) * 190;
      width = 190 * row["2"];
      if (row["3"]) {
        width += 10 + 190 * row["3"];
        if (row["4"]) {
          width += 10 + 190 * row["4"];
        }
      }
    } else if (row["3"]) {
      x = 600 + (1 - row["3"]) * 190;
      width = 190 * row["3"];
      if (row["4"]) {
        width += 10 + 190 * row["4"];
      }
    } else if (row["4"]) {
      x = 800 + (1 - row["4"]) * 190;
      width = 190 * row["4"];
    }
    cx = x + width / 2;

    return (
      <>
        <rect
          x={x}
          y={`${80 + 40 * (i + 1)}`}
          width={width}
          height="30"
          style={{
            fill: "rgb(255,255,255)",
            strokeWidth: 1,
            stroke: "rgb(0,0,0)",
          }}
        />
        {renderOrg(data, i, row.Organization, row.OrgLink)}
        <text
          x="300"
          y={`${80 + 40 * (i + 1) + 22}`}
          fontSize="14px"
          textAnchor="middle"
        >
          {renderLink(row.Activity, row.Link, cx, getWidthInTextUnits(width))}
        </text>
        {renderCategory(data, i, row.Category)}
      </>
    );
  }

  return (
    <>
    <div position="fixed">
    <div width="1020" margin="auto" className="flex-container-roadmap">
        <select
          className="search-select"
          /*
      // here we create a basic select input
      // we set the value to the selected value
      // and update the setFilterParam() state every time onChange is called
      */
          onChange={(e) => {
            setFilterParam(e.target.value);
          }}
          aria-label="Filter Roadmap By Organization"
        >
          <option value="All">Filter By Organization</option>

          {[...new Set(data.map((item) => item.Organization))]
            .sort()
            .map((element, index, array) => (
              <option key={index} value={element}>
                {element}
              </option>
            ))}
        </select>
        <div className="search-wrapper">
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              value={q}
              /*
                    // set the value of our useState q
                    //  anytime the user types in the search box
                    */
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="sr-only">Search countries here</span>
          </label>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1020"
        height="100"
        style={{ marginBottom: "10px" }}
      >
        {console.log("length", search(data).length)}
        <g id="roadmap">
          <rect
            x="0"
            y="0"
            width="190"
            height="50"
            style={{
              fill: "rgb(255,255,255)",
              strokeWidth: 1,
              stroke: "#2AA8A8",
            }}
          />
          <rect
            x="0"
            y="50"
            width="190"
            height="50"
            style={{
              fill: "rgb(255,255,255)",
              strokeWidth: 1,
              stroke: "#2AA8A8",
            }}
          />
          <rect x="200" y="0" width="190" height="100" fill="#212180" />
          <rect x="400" y="0" width="190" height="100" fill="#212180" />
          <rect x="600" y="0" width="190" height="100" fill="#212180" />
          <rect x="800" y="0" width="190" height="100" fill="#212180" />
          <text textAnchor="middle" style={{ fill: "#2AA8A8" }}>
            <tspan x="100" y="20">
              DPGA
            </tspan>
            <tspan x="100" dy="1em">
              Strategic Objectives
            </tspan>
            <tspan x="100" y="70">
              DPGA
            </tspan>
            <tspan x="100" dy="1em">
              Organizations
            </tspan>
          </text>
          <text
            x="300"
            y="0"
            fontSize="13px"
            textAnchor="middle"
            style={{ fill: "white" }}
          >
            <tspan x="295" dy="3em">
              1) DPGs are discoverable,
            </tspan>
            <tspan x="295" dy="1.2em">
              sustainably managed, and
            </tspan>
            <tspan x="295" dy="1.2em">
              accessible
            </tspan>
          </text>
          <text
            x="500"
            y="0"
            fontSize="13px"
            textAnchor="middle"
            style={{ fill: "white" }}
          >
            <tspan x="495" dy="1.5em">
              2) UN-institutions, multilateral
            </tspan>
            <tspan x="495" dy="1.2em">
              development banks and other
            </tspan>
            <tspan x="495" dy="1.2em">
              public and private institutions
            </tspan>
            <tspan x="495" dy="1.2em">
              have capacity to promote and
            </tspan>
            <tspan x="495" dy="1.2em">
              support DPG adoption
            </tspan>
          </text>
          <text
            x="700"
            y="0"
            fontSize="13px"
            textAnchor="middle"
            style={{ fill: "white" }}
          >
            <tspan x="695" dy="2em">
              3) LMIC Governments have
            </tspan>
            <tspan x="695" dy="1.2em">
              capacity to deploy, maintain
            </tspan>
            <tspan x="695" dy="1.2em">
              and evolve DPGs for{" "}
            </tspan>
            <tspan x="695" dy="1.2em">
              digital public infrastructure
            </tspan>
          </text>
          <text
            x="900"
            y="0"
            fontSize="13px"
            textAnchor="middle"
            style={{ fill: "white" }}
          >
            <tspan x="895" dy="2em">
              4) LMICs have vibrant
            </tspan>
            <tspan x="895" dy="1.2em">
              commercial ecosystems
            </tspan>
            <tspan x="895" dy="1.2em">
              capacity to create, maintain,
            </tspan>
            <tspan x="895" dy="1.2em">
              and implement DPGs locally
            </tspan>
          </text>
        </g>
      </svg>
      <div
        style={{
          maxHeight: "800",
          width: "1020",
          marginBottom: "50px",
          marginLeft: "390px",
          overflowY: "scroll",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1020"
          height={150 + 40 * search(data).length}
          style={{ marginTop: "-100px" }}
        >
          {console.log("length", search(data).length)}
          <g id="roadmap-scroll">
            {search(data).map((element, index, array) => (
              <Fragment key={index}>
                <rect
                  x="200"
                  y={`${80 + 40 * (index + 1)}`}
                  width="190"
                  height="30"
                  fill="#C2C3CC"
                />
                <rect
                  x="400"
                  y={`${80 + 40 * (index + 1)}`}
                  width="190"
                  height="30"
                  fill="#C2C3CC"
                />
                <rect
                  x="600"
                  y={`${80 + 40 * (index + 1)}`}
                  width="190"
                  height="30"
                  fill="#C2C3CC"
                />
                <rect
                  x="800"
                  y={`${80 + 40 * (index + 1)}`}
                  width="190"
                  height="30"
                  fill="#C2C3CC"
                />
                {renderCell(array, array[index], index)}
              </Fragment>
            ))}
          </g>
        </svg>
      </div>
    </div>
      
    </>
  );
}

export default Roadmap;
