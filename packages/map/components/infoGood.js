import {useState, useEffect} from "react";
import webSymbol from "../public/globe.png";
import ghLogo from "../public/github.png";
import Image from "next/image";

export default function InfoGood(props) {
  const sdgs = [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequality",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace and Justice Strong Institutions",
    "17. Partnerships to achieve the Goal",
  ];
  const [dropDownList, setDropDownList] = useState({
    development: false,
    deployment: false,
    ...Object.fromEntries(sdgs.map((key) => [key, false])),
  });
  const toggleList = (type) => {
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
    setDropDownList((prevState) => {
      return Object.fromEntries(Object.keys(prevState).map((key) => [key, false]));
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
            return (
              <li key={"type-" + item}>
                ✅&nbsp;Open {item.replace("aimodel", "AI model")}
              </li>
            );
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
          console.log(dropDownList);
          return (
            <div key={"SDG-" + item.SDGNumber} className="header">
              <p
                className="collapsable-text"
                onClick={(e) => toggleList([sdgs[item.SDGNumber - 1]])}
              >
                {sdgs[item.SDGNumber - 1]}{" "}
                <span
                  className={
                    dropDownList[sdgs[item.SDGNumber - 1]]
                      ? "arrow active up"
                      : "arrow active down"
                  }
                ></span>
              </p>
              {item.evidenceText && dropDownList[sdgs[item.SDGNumber - 1]] && (
                <p>{item.evidenceText}</p>
              )}
              {item.evidenceURL &&
                dropDownList[sdgs[item.SDGNumber - 1]] &&
                parseURLs(item.evidenceURL)}
            </div>
          );
        })}
      </div>
      <div className="goodContainer">
        {Object.keys(props.selectedGood.locations.deploymentCountries).length > 0 && (
          <div className="header">
            <p className="collapsable-text" onClick={(e) => toggleList("deployment")}>
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
            <p className="collapsable-text" onClick={(e) => toggleList("development")}>
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
