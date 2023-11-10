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
    if (text.length + 17 > maxLength) {
      const truncatedText = `${text.substring(0, maxLength - 18)}...`;
      const truncatedLength = truncatedText.length;
      const requiredLength = maxLength - truncatedLength;
      return requiredLength > 15.1 && requiredLength < 15.16
          ? `${text.substring(0, truncatedLength + 10)}...`
          : `${text.substring(0, truncatedLength - 3)}...`;
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

  function toggleVisibleMember(event) {
    let parent = event.target.parentElement;
    parent.querySelectorAll('ul').forEach(element => {
      if (element.style.display !== 'none') {
        element.style.display = 'none';
      }
      else {
        element.style.removeProperty('display');
      }
    });
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
      <div>
        <div className="hide-on-desktop-block">

          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>BMGF</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://www.codevelop.fund/">Support DPGs for DPI via Co-Develop Fund</a></li>
              <li>Direct funding and local capacity for G2PX</li>
              <li>Direct funding for DPGs: MOSIP, Mojaloop, DHIS2 (core platform)</li>
              <li>Scaling the Digital Stack in Africa</li>
              <li>Support for Health DPGs, Global Goods via Digital Square</li>
              <li>Support identification for development through the ID4D initiative</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>data.org</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://data.org/initiatives/epiverse/">Contribute to Epidemic Analysis DPGs via Epiverse
                Initiative</a></li>
              <li><a href="https://data.org/initiatives/challenge/">Invests in Creating and Scaling Data Analytics
                DPGs</a></li>
              <li><a href="https://data.org/initiatives/capacity/">Support Building Data Science &amp; Analytics Capacity
                via CAN</a></li>
              <li><a href="https://data.org/library/">The Data Resource Libary</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>DIAL</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://dial.global/work/communities-of-practice/">“Good” DPI Advocacy</a></li>
              <li><a href="http://dpgcharter.org">Co-Leading the Digital Public Goods Charter</a></li>
              <li><a href="https://www.govstack.global">GovStack Leadership</a></li>
              <li><a href="https://dial.global/our-research/">Research to support the DPG for DPI Agenda</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Digital Square at PATH</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://digitalsquare.org/market-analytics">Develop Digital Square Ownership Costing Tool</a>
              </li>
              <li>Informatics Savvy Health Organization</li>
              <li><a href="https://digitalsquare.org/resourcesrepository/2023/5/25/global-goods-guidebook-version-40">Launch
                Digital Square Global Goods Guidebook V4</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>DPGA Secretariat</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Advocacy for UN, Government &amp; Institutional Alignment Around DPGs</li>
              <li><a href="https://dial.global/charter/">Co-Coordinate DPG Charter to Mobilise High-Level Commitments to
                DPGs</a></li>
              <li><a href="https://digitalpublicgoods.net/what-we-do/#cop">Convene Communities of Practice on Priority
                Topics</a></li>
              <li><a href="https://digitalpublicgoods.net/standard/">Increase Adoption of DPG Definition &amp;
                Standard</a></li>
              <li>Mobilise Relevant Policy Pledges for DPGs</li>
              <li>Mobilize &amp; Coordinating Funding for DPGs</li>
              <li><a href="https://digitalpublicgoods.net/standard/">Steward &amp; Evolve the DPG Definition and
                Standard</a></li>
              <li><a href="https://digitalpublicgoods.net/registry/">Stregthen DPG Registry &amp; Nomination</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>eGovernments Foundation</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Advocate for DPGs for Governance with State Governments in India</li>
              <li><a href="https://www.digit.org/">Ensure more diverse participation in DIGIT platform</a></li>
              <li>Health campaigns management on DIGIT</li>
              <li>Integrate DIGIT Sanitation wih NUDM</li>
              <li>Integrate DIGIT Sanitation with IoT, GIS, vehicle tracking</li>
              <li>Integrated real time service delivery on iFIX</li>
              <li><a href="https://nudm.mohua.gov.in/">Platform for National Urban Digital Mission India (NUDM)</a></li>
              <li><a href="https://divoc.egov.org.in/">Support LMICs with vaccine credentialing via DIVOC</a></li>
              <li><a href="https://lnkd.in/gf47EFPd">Usecases for open credentialing in health</a></li>
              <li>Works management platform development</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>FAO</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Co-Chair Food Security Community Of Practice</li>
              <li>Create an FAO Digital Public Goods Framework</li>
              <li>Identify Existing and Potential DPGs within the FAO Digital Portfolio</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Foundation for Public Code</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://publiccode.net/codebase-stewardship/">Provide Codebase Stewardship Services to DPGs</a>
              </li>
              <li><a href="https://standard.publiccode.net/">Steward the Standard for Public Code</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Germany (BMZ)</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="#SmartDevelopmentFund - Eight digital solutions to counter COVID‑19 (d4dhub.eu)">#SmartDevelopmentFund:
                Support 9 digital initiatives</a></li>
              <li><a href="https://health.bmz.de/stories/bringing-the-power-of-digital-data-to-rural-nepal/">Country
                Technical Support for Health DPGs-DHIS2, OpenSRP</a></li>
              <li><a href="https://digilab.bmz-digital.global/projekte/digital-payment-infrastructure-mojaloop/">Digilab:
                Pilot of DPGs for digital ID and payments (Mojaloop in Rwanda, MOSIP in Mauretania)</a></li>
              <li><a href="Home Page | openIMIS">Direct funding &amp; management of DPGs-OpenIMIS, TruBudget</a></li>
              <li><a href="FAIR Forward – Open data for AI (bmz-digital.global)">FAIR Forward - Artificial Intelligence
                for All</a></li>
              <li><a href="Home - GovStack">GovStack: Develop more building blocks specs, sandbox, prototype use cases,
                country capacity</a></li>
              <li><a href="Digital Convergence Initiative - DCI - Social Protection (spdci.org)">GV SPIL: Convergence
                Initiative under USP 2030</a></li>
              <li><a href="Digital pandemic control | BMZ Digital.Global (bmz-digital.global)">Product suite for vaccine
                logistics based on mature DPGs and WHO SMART</a></li>
              <li>Sourcing EU funded DPI potential DPGs</li>
              <li><a
                  href="https://www.ilo.org/newyork/at-the-un/social-protection-inter-agency-cooperation-board/lang--en/index.htm">SV
                SoSi SPIAC-B working group on digital social protection</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>GitHub</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://socialimpact.github.com/insights/social-sector-oss-lmics-research-project/">Contribute
                to UNSG’s Roadmap for Digital Cooperation</a></li>
              <li><a href="https://socialimpact.github.com/insights/">Develop Resources on using Open Source for MERL</a>
              </li>
              <li>Developing Standardized Metrics with GitHub Data for the Social Sector</li>
              <li>DPG Advocacy &amp; Awareness through Social Impact Team</li>
              <li><a href="https://socialimpact.github.com/tech-for-social-good/">DPG Advocacy &amp; Awareness via Social
                Impact Team</a></li>
              <li>Easier access to GitHub tools for DPGs</li>
              <li>GitHub &lt;&gt; Registry Integration</li>
              <li>GitHub &lt;&gt; Registry Integration</li>
              <li><a
                  href="Introducing Activating Developers and the new Digital Public Goods Open Source Community Manager Program | The GitHub Blog">GitHub
                Activating Developers Program</a></li>
              <li>Open Source in the Social Sector Training</li>
              <li><a href="https://socialimpact.github.com/insights/">Pilots of Skill-Based Volunteering via Social Impact
                Program</a></li>
              <li><a href="https://github.blog/2022-09-08-research-open-source-software-in-india-kenya-egypt-and-mexico/">Research
                Initiative on DPGs</a></li>
              <li><a href="https://socialimpact.github.com/insights/oss-india-kenya-egypt-mexico/">Research Initiative on
                DPGs</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Government of Bangladesh</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://ssn4psi.com/">Advocacy via the South-South Network for Public Service Innovations
                (SSN4PSI)</a></li>
              <li><a href="https://www.ekshop.gov.bd/">Build and maintain new software DPGs (ex. EkShop &amp; NISE)</a>
              </li>
              <li>Introduce DPGs into Bangladesh&#x27;s DPI via the MyGov platform</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Government of Ethiopia</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Apply OpenG2P Based Service for PSNP(as a DPG)</li>
              <li>Build a DPI Sandbox</li>
              <li>Develop DPI Based Reference Architecture for Ethiopian Public Service</li>
              <li><a href="Partnership with MOSIP">Implementing National ID to enhance service delivery using MOSIP</a>
              </li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Government of Guatemala</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Advance interoperability and data exchange using X-Road and CKAN</li>
              <li>Advancing DPG-based digital payment solutions</li>
              <li>Build DPG capacity to strengthen a National System for Legal Digital Identity</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Government of Sri Lanka</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Adoption and scaling of DHIS2 for education by the Ministry of Education</li>
              <li>Adoption of MOSIP as the foundational identity platform for Sri Lanka Unique Digital Identity (SLUDI)
                Project:</li>
              <li>Building DPG knowledge and capacity at the Ministry of Technology and ICTA, also to the benefit of other
                DPGA member countries:</li>
              <li>Conducting awareness sessions to the local ICT vendor ecosystem to build capacity on DPGs and Open
                Source</li>
              <li>Creating awareness on cross-sectoral use of DHIS2 for government IT Staff</li>
              <li>Creating awareness targeting both the domestic and global DPG community about the use of DPGs by the
                Government of Sri Lanka through case studies, whitepapers, blogs, newspaper articles and social media
              </li>
              <li>Exploration and evaluation of new DPGs for adoption by the Government of Sri Lanka</li>
              <li>Inclusion of an open source and DPGs-first approach in the Digital Government Policy</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Inter-American Development Bank</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://code.iadb.org/en/tools">Code for Development repository for Open-Source Software</a>
              </li>
              <li><a href="https://code.iadb.org/en/code4dev ">Code4Dev Network</a></li>
              <li><a href="https://code.iadb.org/en/tools">Development of IDB open-source tools</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>iSPIRT</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://pn.ispirt.in/virtual-meeting-on-data-empowerment-august-31-2021/">D6 - Data Empowerment
                Multilateral Meeting</a></li>
              <li><a
                  href="https://www.orfonline.org/research/data-empowerment-and-protection-architecture-concept-and-assessment/">Data
                Empowerement and Protection Architecture (DEPA)</a></li>
              <li><a href="https://developers.ispirt.in/#/healthstack">HealthStack</a></li>
              <li><a href="https://developers.ispirt.in/#/">Incubating DPGS for Infrastructure in India (i.e. OCEN)</a>
              </li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>ITU</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Establishing an ITU wide Open-Source Programme Office (OSPO)</li>
              <li><a href="https://www.govstack.global/">GovStack Initiative</a></li>
              <li>Open-source Ecosystem Enablement for Public Services Innovation</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Norwegian Agency for Development
              Cooperation (Norad)</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Direct Development of DPGs (Global Digital Library, MET Norway,...)</li>
              <li>Direct funding for DPGs (DHIS2, MOSIP, OpenCRVS)</li>
              <li>Engage in donor coordination around DPI</li>
              <li>Explore DPGs for women’s empowerment and strengthening of human rights</li>
              <li>Explore DPGs in data platforms for climate and environment</li>
              <li>Extension of Global Digital Library from literacy to maths</li>
              <li>Fund Multilateral Agencies for Implementing the DPG Agenda</li>
              <li>Funding Multilateral Agencies for Implementing the DPG Agenda</li>
              <li>Source DPGs for DPI</li>
              <li>Support country capacity building by leveraging academia (with HISP/University of Oslo)</li>
              <li>Support DPGs against information pollution</li>
              <li>Support individual DPGs on security dependencies</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Open Source Initiative</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://deepdive.opensource.org/">“Deep Dive AI” education series</a></li>
              <li><a href="https://opensource.org/node/654">Open Source License Clinics - public sector</a></li>
              <li><a href="https://opensource.org/StateOfTheSource">State of the Source event</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Rockefeller Foundation</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://mojaloop.io">Advocating for and mobilizing around DPGs</a></li>
              <li><a href="Home (g2p connect.global)">Funding the sustainable development of G2P Connect</a></li>
              <li><a href="Co-Develop (codevelop.fund)">Setting up the Co-Develop Fund</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Rwanda Ministry of ICT and Innovation
            </div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a
                  href="https://africabusinesscommunities.com/tech/tech-news/government-of-rwanda-and-google-collaborate-to-accelerate-digital-transformation/">Cashless
                Accelerator Program</a></li>
              <li><a href="https://twitter.com/rwandaict/status/1340959442439983105">Innovation Policy Lab - developing
                digital policies to support adoption of DPGs and DPIs</a></li>
              <li><a href="https://www.minict.gov.rw/open-data-portal">Open Data Portal for Citizens</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Sierra Leone (DSTI)</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a
                  href="OpenG2P Docs / https://docs.google.com/document/d/1lne5SQsqxD-n-AmD3KIVv7rszNrK1Eic/edit?usp=sharing&ouid=115183423997508672803&rtpof=true&sd=true">Creating
                &amp; Managing New DPGs (i.e. OpenG2P, Prestrack)</a></li>
              <li><a href="https://www.dsti.gov.sl/10-things-to-learn-from-dsti-and-unicefs-hackathon/">Districts DPG 3D
                Printing Hackathon</a></li>
              <li>Innovation and Career Guidance Seminar: DPGs for Sustainable Development</li>
              <li><a href="https://docs.google.com/document/d/1AV2LFreqHw-bqJoEJQaCjwsYhhd8vNFt/edit">Launch and
                operationalise a National DPG coordination committee</a></li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>Thoughtworks</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="www.bahmni.org">Bahmni for Clinics</a></li>
              <li><a href="https://www.thoughtworks.com/en-ca/insights/topic/open-source/epirust">Epirust for Disease
                Modelling</a></li>
              <li><a href="https://blog.thoughtworks.net/rajesh-rajagopalan/evolving-color%27s-of-indias-commerce">Local
                Language Support for Digital Commerce</a></li>
              <li><a href="https://www.cloudcarbonfootprint.org/">On Prem - Cloud Carbon Footprint</a></li>
              <li>Simplifying Product Catalog Digitization</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>UN Global Pulse</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a
                  href="https://www.unglobalpulse.org/2021/10/using-digital-public-goods-to-help-save-the-lives-of-mothers-and-babies/">Advancing
                DPGs in maternal, newborn and child health</a></li>
              <li>Co-Chair the Open Data Community of Practice</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>UNDP</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Empower UNDP&#x27;s global network of staff and local partners on DPGs</li>
              <li>Identify transformative DPGs within UNDPs network</li>
              <li>Thought-leadership on deploying inclusive DPGs at scale</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>UNICEF</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Advocate for Government &amp; UN Alignment Around DPGs</li>
              <li>Co-Chair: Health Community of Practice</li>
              <li><a href="https://www.unicef.org/innovation/dpg-pathfinding-countries/ghana">Continuation of Pathfinder
                Pilot: Ghana</a></li>
              <li><a href="https://www.unicef.org/innovation/dpg-pathfinding-countries/kazakhstan">Continuation of
                Pathfinder Pilot: Kazakhstan</a></li>
              <li><a href="https://twitter.com/DSTISierraLeone/status/1621452622052851712?cxt=HHwWgICw2bSkx4AtAAAA">Continuation
                of Pathfinder Pilot: Sierra Leone</a></li>
              <li>Crypto and Innovative Financing Experiments to fund DPGs</li>
              <li><a href="https://github.com/unicef/publicgoods-toolkit">Deliver DPG Operational Toolkit for
                Governments</a></li>
              <li>Digital Centre of Excellence (DCOE)</li>
              <li>Global Data &amp; Digital Implementation Guidelines</li>
              <li><a href="https://www.un.org/techenvoy/global-digital-compact">Global Digital Compact DPG Advocacy</a>
              </li>
              <li>Pilot youth-enabled DPG incubators in select countries</li>
              <li>Standardizing Data and Data Use for Health</li>
              <li><a href="https://digitalpublicgoods.net/eligibility/">Streamlining DPG Nominations</a></li>
              <li>UNICEF Technology Planning, Procurement &amp; Deployment Playbook</li>
              <li>UNICEF Venture Fund - Frontier Technology DPG Investmets</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>United Nations Office of the
              Secretary-General’s Envoy on Technology</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li>Facilitate collaborations between DPGA and other initiatives</li>
              <li>Promote DPG work to relevant parties, including member states</li>
              <li>Support open source capacity building within the UN System</li>
            </ul>
          </div>
          <div className="mobile-member">
            <div className="mobile-member-container" onClick={toggleVisibleMember}>USAID</div>
            <ul className="mobile-actionitems" style={{display:"none"}}>
              <li><a href="https://digitalsquare.org/">Funding DPGs for health through Digital Square</a></li>
              <li><a href="https://www.jsi.com/project/country-health-information-systems-and-data-use-chisu/">Support
                country capacity to use health information systems</a></li>
              <li><a href="https://www.dpgcharter.org/">Support the DPG Charter</a></li>
            </ul>
          </div>


        </div>
        <div className="hide-on-mobile-block">
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
          <div style={{ width: "100%" }}>
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
                  marginLeft: "auto",
                  marginRight: "auto",
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
        </div>
      </div>
  );
}

export default Roadmap;

