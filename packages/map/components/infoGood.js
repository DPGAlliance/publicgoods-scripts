import {useState, useEffect} from "react";
import webSymbol from "../public/globe.png";
import ghLogo from "../public/github.png";
import Image from "next/image";

export default function InfoGood(props) {
  const sdgsDefault = [
    {name: "1. No Poverty", open: false},
    {name: "2. Zero Hunger", open: false},
    {name: "3. Good Health and Well-being", open: false},
    {name: "4. Quality Education", open: false},
    {name: "5. Gender Equality", open: false},
    {name: "6. Clean Water and Sanitation", open: false},
    {name: "7. Affordable and Clean Energy", open: false},
    {name: "8. Decent Work and Economic Growth", open: false},
    {name: "9. Industry, Innovation and Infrastructure", open: false},
    {name: "10. Reduced Inequality", open: false},
    {name: "11. Sustainable Cities and Communities", open: false},
    {name: "12. Responsible Consumption and Production", open: false},
    {name: "13. Climate Action", open: false},
    {name: "14. Life Below Water", open: false},
    {name: "15. Life on Land", open: false},
    {name: "16. Peace and Justice Strong Institutions", open: false},
    {name: "17. Partnerships to achieve the Goal", open: false},
  ];
  const [sdgs, setSdgs] = useState([...sdgsDefault]);
  const toggleEvidence = (i) => {
    sdgs[i].open = !sdgs[i].open;
    setSdgs([...sdgs]);
  };
  const [dropDownList, setDropDownList] = useState({
    development: false,
    deployment: false,
  });
  const toggleCountries = (type) => {
    setDropDownList((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };
  const handleSelectCountry = (event, countryCode) => {
    event.preventDefault();
    event.stopPropagation();
    props.onSelectCountry(countryCode);
  };
  const parseURLs = (text) => {
    const url =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    let urls = text.match(url);
    return urls.map((url, index) => (
      <a key={url + index} href={url} target="_blank" rel="noreferrer">
        Link to evidence
      </a>
    ));
  };
  useEffect(() => {
    sdgs.map((e) => (e.open = false));
    setSdgs([...sdgs]);
    setDropDownList({
      development: false,
      deployment: false,
    });
  }, [props.selectedGood]);
  return (
    <div>
      <div className="goodContainer">
        <h2 className="goodName">{props.selectedGood.name}</h2>
        <div className="centered">
          {props.selectedGood.website && (
            <a href={props.selectedGood.website} target="_blank" rel="noreferrer">
              <Image
                src={webSymbol}
                alt="image link to projects website"
                width={30}
                height={30}
              />
            </a>
          )}
          {props.selectedGood.repositoryURL && (
            <a href={props.selectedGood.repositoryURL} target="_blank" rel="noreferrer">
              <Image src={ghLogo} alt="image link to github" width={30} height={30} />
            </a>
          )}
        </div>
        <p className="goodDesc">{props.selectedGood.description}</p>
      </div>
      <ul className="goodContainer">
        {" "}
        <p className="text-bold">Type of Digital Public Good</p>
        {["content", "data", "software", "standard", "aimodel"].map((item) => {
          if (props.selectedGood.type.includes(item)) {
            return <li key={"type-" + item}>✅&nbsp;Open {item.replace("aimodel", "AI model")}</li>;
          } else {
            return (
              <li key={"type-" + item}>
                <svg width="18" height="18">
                  <rect width="18" height="18" fillOpacity="0" className="rect" />
                </svg>
                &nbsp;Open {item.replace("aimodel", "AI model")}
              </li>
            );
          }
        })}
      </ul>
      <div className="goodContainer">
        <p className="text-bold">Relevant Sustainable Development Goals:</p>
        {props.selectedGood["SDGs"].map((item) => {
          return (
            <div key={"SDG-" + item.SDGNumber} className="header">
              <p
                className="collapsable-text"
                onClick={(e) => toggleEvidence(item.SDGNumber - 1)}
              >
                {sdgs[item.SDGNumber - 1].name}{" "}
                <span
                  className={
                    sdgs[item.SDGNumber - 1].open
                      ? "arrow active up"
                      : "arrow active down"
                  }
                ></span>
              </p>
              {item.evidenceText && sdgs[item.SDGNumber - 1].open && (
                <p>{item.evidenceText}</p>
              )}
              {item.evidenceURL &&
                sdgs[item.SDGNumber - 1].open &&
                parseURLs(item.evidenceURL)}
            </div>
          );
        })}
      </div>
      <div className="goodContainer">
        {Object.keys(props.selectedGood.locations.deploymentCountries).length > 0 && (
          <div className="header">
            <p
              className="collapsable-text"
              onClick={(e) => toggleCountries("deployment")}
            >
              {"Deployed in " +
                Object.keys(props.selectedGood.locations.deploymentCountries).length +
                " of 249 countries:"}{" "}
              <span
                className={
                  dropDownList.deployment ? "arrow active up" : "arrow active down"
                }
              ></span>
            </p>

            {dropDownList.deployment &&
              Object.entries(props.selectedGood.locations.deploymentCountries).map(
                (country, i) => {
                  return (
                    <a
                      className={
                        Object.entries(props.selectedGood.locations.deploymentCountries)
                          .length -
                          1 ==
                        i
                          ? "last"
                          : ""
                      }
                      onClick={(e) => handleSelectCountry(e, country[0])}
                      key={"deploy-" + country}
                    >
                      {country[1]}
                    </a>
                  );
                }
              )}
          </div>
        )}
        {Object.keys(props.selectedGood.locations.developmentCountries).length > 0 && (
          <div className="header">
            <p
              className="collapsable-text"
              onClick={(e) => toggleCountries("development")}
            >
              {"Developed in " +
                Object.keys(props.selectedGood.locations.developmentCountries).length +
                (Object.keys(props.selectedGood.locations.developmentCountries).length > 1
                  ? " countries:"
                  : " country:")}{" "}
              <span
                className={
                  dropDownList.development ? "arrow active up" : "arrow active down"
                }
              ></span>
            </p>

            {dropDownList.development &&
              Object.entries(props.selectedGood.locations.developmentCountries).map(
                (country, i) => {
                  return (
                    <a
                      className={
                        Object.entries(props.selectedGood.locations.developmentCountries)
                          .length -
                          1 ==
                        i
                          ? "last"
                          : ""
                      }
                      onClick={(e) => handleSelectCountry(e, country[0])}
                      key={"develop-" + country}
                    >
                      {country[1]}
                    </a>
                  );
                }
              )}
          </div>
        )}
      </div>
    </div>
  );
}
