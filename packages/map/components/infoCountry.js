import {useState, useEffect} from "react";
import Chart from "react-google-charts";

export default function InfoCountry(props) {
  const [dropDownList, setDropDownList] = useState({
    deploymentsInCountry: false,
    developmentsInCountry: false,
  });
  const toggleList = (type) => {
    setDropDownList((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };
  const handleSelectGood = (event, good) => {
    event.preventDefault();
    event.stopPropagation();
    props.onSelectGood(good);
  };
  useEffect(() => {
    setDropDownList({
      deploymentsInCountry: false,
      developmentsInCountry: false,
    });
  }, [props.selectedCountry]);
  return (
    <div>
      {props.selectedCountry.pathfinder && (
        <div>
          <h3>{props.selectedCountry.name}</h3>
          <span>✅&nbsp;&nbsp;DPG Pathfinder Country</span>
          <ul>
            <li>
              <b>Status: </b>
              {props.selectedCountry.pathfinder.Status}
            </li>
            {props.selectedCountry.pathfinder.Sector && (
              <li>
                <b>Sector: </b>
                {props.selectedCountry.pathfinder.Sector}
              </li>
            )}

            {props.selectedCountry.pathfinder.Comments && (
              <li>
                <b>Comments: </b>
                {props.selectedCountry.pathfinder.Comments}
              </li>
            )}
          </ul>
        </div>
      )}

      {props.selectedCountry.deployments.length > 0 && (
        <div>
          <div className="header">
            <p
              className="collapsable-text"
              onClick={() => toggleList("deploymentsInCountry")}
            >
              There {props.selectedCountry.deployments.length > 1 ? "are" : "is"}{" "}
              {props.selectedCountry.deployments.length} digital public good
              {props.selectedCountry.deployments.length > 1 ? "s" : ""} deployed in{" "}
              {props.selectedCountry.name}
              <span
                className={
                  dropDownList.deploymentsInCountry
                    ? "arrow active up"
                    : "arrow active down"
                }
              ></span>
            </p>
            {dropDownList.deploymentsInCountry &&
              props.selectedCountry.deployments.map((good, i) => (
                <a
                  className={
                    props.selectedCountry.deployments.length - 1 == i ? "last" : ""
                  }
                  key={good.name + i}
                  onClick={(e) => handleSelectGood(e, good.name)}
                >
                  {good.name}
                </a>
              ))}
          </div>
          <p>
            DPGs deployed in this country are related to{" "}
            {
              props.selectedCountry.sdgsDeployments.filter((sdg) => sdg[1].dpgs >= 1)
                .length
            }{" "}
            of 17(
            {(
              (props.selectedCountry.sdgsDeployments.filter((sdg) => sdg[1].dpgs >= 1)
                .length /
                17) *
              100
            ).toFixed(1)}
            %) Sustainable Development Goals
          </p>
          <div className={"chart-container"}>
            <Chart
              className="clickable"
              width={"100%"}
              height={"600px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["SDG", "DPGs", {role: "annotation", calc: "stringify", type: "string"}],
                ...props.selectedCountry.sdgsDeployments.map((sdg) => [
                  sdg[0],
                  sdg[1].dpgs,
                  sdg[1].ann + ": " + sdg[1].dpgs,
                ]),
              ]}
              options={{
                animation: {
                  startup: true,
                  easing: "out",
                  duration: 500,
                },
                annotations: {
                  textStyle: {
                    fontSize: 11,
                    bold: false,
                    color: "black",
                  },
                },
                colors: ["#3333AB"],
                chartArea: {width: "85%", height: "90%", top: 0},
                hAxis: {
                  baselineColor: "#cccccc",
                  titleTextStyle: {italic: false, fontSize: 12},
                  title: "Digital public goods",
                  minValue: 0,
                  format: "#",
                },
                legend: {position: "none"},
              }}
              chartEvents={[
                {
                  eventName: "select",
                  callback: ({chartWrapper}) => {
                    const chart = chartWrapper.getChart();
                    const selection = chart.getSelection();
                    props.onSelectSdg(selection[0].row + 1);
                  },
                },
              ]}
            />

            <b>Types of DPGs deployed in {props.selectedCountry.name}</b>
            <Chart
              width={"100%"}
              height={"180px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["SDG", "DPGs", {role: "annotation", calc: "stringify"}],
                ...props.selectedCountry.typeDeployments
                  .sort((a, b) => b[1] - a[1])
                  .map((el) => [
                    ...el,
                    el[0].replace("aimodel", "AI model") + ": " + el[1],
                  ]),
              ]}
              options={{
                animation: {
                  startup: true,
                  easing: "out",
                  duration: 500,
                },
                colors: ["#3333AB"],
                chartArea: {width: "85%", height: "85%", top: 0},
                hAxis: {
                  baselineColor: "#cccccc",
                  titleTextStyle: {italic: false, fontSize: 12},
                  title: "Digital public goods",
                  minValue: 0,
                },
                vAxis: {
                  textPosition: "none",
                },
                legend: {position: "none"},
                annotations: {
                  textStyle: {
                    fontSize: 11,
                    bold: false,
                    color: "black",
                  },
                },
              }}
            />
          </div>
        </div>
      )}
      {props.selectedCountry.developments.length > 0 && (
        <div className="header">
          <p
            className="collapsable-text"
            onClick={() => toggleList("developmentsInCountry")}
          >
            There {props.selectedCountry.developments.length > 1 ? "are" : "is"}{" "}
            {props.selectedCountry.developments.length} digital public good
            {props.selectedCountry.developments.length > 1 ? "s" : ""} developed in{" "}
            {props.selectedCountry.name}
            <span
              className={
                dropDownList.developmentsInCountry
                  ? "arrow active up"
                  : "arrow active down"
              }
            ></span>
          </p>
          {dropDownList.developmentsInCountry &&
            props.selectedCountry.developments.map((good, i) => (
              <a
                className={
                  props.selectedCountry.developments.length - 1 == i ? "last" : ""
                }
                key={good.name + i}
                onClick={(e) => handleSelectGood(e, good.name)}
              >
                {good.name}
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
