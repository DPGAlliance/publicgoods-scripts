import {useState, useEffect} from "react";
import Chart from "react-google-charts";
export default function InfoSdg(props) {
  const [dropDownList, setDropDownList] = useState({
    goodsInSDG: false,
  });
  const handleSelectGood = (event, good) => {
    event.preventDefault();
    event.stopPropagation();
    props.onSelectGood(good);
  };
  const toggleList = (type) => {
    setDropDownList((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };
  useEffect(() => {
    setDropDownList({
      goodsInSDG: false,
    });
  }, [props.selectedSdg]);
  return (
    <div className={"chart-container"}>
      <div className="header">
        <p className="collapsable-text" onClick={() => toggleList("goodsInSDG")}>
          {props.selectedSdg.totalDpgs.length} Digital Public Good
          {props.selectedSdg.totalDpgs.length > 1 && "s"} that achive "
          {props.selectedSdg.name}"{" "}
          {props.selectedSdg.totalDpgs.length > 1 ? "are" : "is"} deployed in{" "}
          {props.selectedSdg.dpgCount.length > 1
            ? `${props.selectedSdg.dpgCount.length} countries`
            : `1 country`}
          .
          <span
            className={dropDownList.goodsInSDG ? "arrow active up" : "arrow active down"}
          ></span>
        </p>
        {dropDownList.goodsInSDG &&
          props.selectedSdg.totalDpgs.map((good, i) => (
            <a
              className={props.selectedSdg.totalDpgs.length - 1 == i ? "last--extra" : ""}
              key={good.name + i}
              onClick={(e) => handleSelectGood(e, good.name)}
            >
              {good.name}
            </a>
          ))}
      </div>

      <Chart
        key={Object.keys(props.selectedSdg.opacity).length} // let us redraw entire chart with new dimensions after changing props.selectedSDg
        width={"100%"}
        height={Object.keys(props.selectedSdg.opacity).length * 30 + 30 + "px"}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Country", "DPGs", {role: "annotation", calc: "stringify", type: "string"}],
          ...props.selectedSdg.dpgCount
            .sort((a, b) => b[1] - a[1])
            .map((country) => [country[0], country[1], country[0] + ": " + country[1]]),
        ]}
        options={{
          animation: {
            startup: true,
            easing: "out",
            duration: 500,
          },
          tooltip: {
            textStyle: {
              fontSize: 11,
            },
          },
          annotations: {
            textStyle: {
              fontSize: 11,
              bold: false,
              color: "black",
            },
          },
          colors: ["#9ed0ff"],
          chartArea: {width: "85%", height: "99%", top: 0},
          hAxis: {
            baselineColor: "#cccccc",
            textStyle: {fontSize: 12},
            minValue: 0,
            format: "#",
          },
          vAxis: {
            textPosition: "none",
          },
          legend: {position: "none"},
        }}
      />
      <div className="centered">
        <span>Digital Public Goods</span>
      </div>
    </div>
  );
}
