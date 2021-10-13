import Chart from "react-google-charts";

export default function InfoSummary(props) {
  return (
    <div className={"chart-container"}>
      <p className="text-bold">
        There are {props.summary.dpgsum} Digital Public Goods that achieve all types of
        Sustainable Development Goals around the world.
      </p>
      <Chart
        width={"100%"}
        height={"600px"}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["SDG", "DPGs", {role: "annotation", calc: "stringify", type: "string"}],
          ...props.summary.sdgsSum.map((sdg) => [
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
              color: "black"
            },
          },
          colors: ["#3333AB"],
          chartArea: {width: "85%", height: "90%", top: 0},
          hAxis: {
            baselineColor: "#cccccc",
            titleTextStyle: {italic: false},
            title: "Digital public goods",
            minValue: 0,
            format: "#",
          },
          legend: {position: "none"},
        }}
      />
      <p className="text-bold">
        Most of Digital Public Goods are{" "}
        {props.summary.typeSum.sort((a, b) => b[1] - a[1])[0][0]}
      </p>
      <Chart
        width={"100%"}
        height={"180px"}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["SDG", "DPGs", {role: "annotation", type: "string", calc: "stringify"}],
          ...props.summary.typeSum.map((el) => [
            ...el,
            `${el[0].replace("aimodel", "AI model")}: ${el[1]}`,
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
            titleTextStyle: {italic: false},
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
              color: "black"
            },
          },
        }}
      />
    </div>
  );
}
