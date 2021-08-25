import React, {useState, useRef} from "react";
import ReactMapboxGl, {ZoomControl, MapContext} from "react-mapbox-gl";
import confirmedPattern from "../public/confirmed.svg";
import exploratoryPattern from "../public/exploratory.svg";
import hardwarePattern from "../public/hardware.svg";
import {Scrollama, Step} from "react-scrollama";
import {InView} from "react-intersection-observer";
import SearchBox from "./searchBox";
import InfoComponent from "./infoComponent";
import UseWindowDimensions from "./UseWindowDimensions";
import dpgaLogo from "../public/logo.svg";

const legends = ["where it was developed", "where it was deployed"];
const colors = ["#FF952A", "#d4d4ec"];
const zoomDefault = 2;
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
// console.log(process.env.MAPBOX_ACCESS_TOKEN)
const Map = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  maxZoom: 9,
  minZoom: 0,
  logoPosition: "bottom-right",
  pitchWithRotate: false,
});

export default function mapComponent(props) {
  const [mapInstance, setMapInstance] = useState();
  const ref = useRef();
  const mainRef = useRef();
  const searchRef = useRef();
  const {width} = UseWindowDimensions();
  const [zoom, setZoom] = useState(zoomDefault);
  const [lonLat, setLonLat] = useState([props.lon, props.lat]);
  const [selectedGood, setSelectedGood] = useState({});
  const [selectedCountry, setSelectedCountry] = useState({});
  const [prevGood, setPrevGood] = useState({});
  const [visibleLayer, setVisibleLayer] = useState({
    "Pathfinders Exploratory": false,
    "Pathfinders Confirmed": false,
    "DPGs deployed": false,
    "DPGs developed": false,
  });
  const [mapInteractive, setMapInteractive] = useState(false);

  // scrollama states
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // This callback fires when a Step hits the offset threshold. It receives the
  // data prop of the step, which in this demo stores the index of the step.
  const onStepEnter = ({data}) => {
    setCurrentStepIndex(data);
    // Check and set selectedGood from gsheet
    if (props.story[data].showDPG) {
      setSelectedGood((prevState) => {
        setPrevGood(prevState);
        return props.digitalGoods.filter(
          (el) =>
            el.name.toLowerCase().indexOf(props.story[data].showDPG.toLowerCase()) !== -1
        )[0]; // filter and grab 1st result
      });
    } else {
      // clear state if there is no dpg in gsheet
      setSelectedGood((prevState) => {
        setPrevGood(prevState);
        return {};
      });
    }
    // Check and set visible layer from gsheet
    if (props.story[data].showFilter) {
      let newVisibleLayer = {};
      Object.keys(visibleLayer).forEach(
        (v) => (newVisibleLayer[v] = props.story[data].showFilter.includes(v))
      );
      setVisibleLayer(newVisibleLayer);
    } else {
      setVisibleLayer({
        "Pathfinders Exploratory": false,
        "Pathfinders Confirmed": false,
        "DPGs deployed": false,
        "DPGs developed": false,
      });
    }
  };

  const handleSelectCountry = (code) => {
    setSelectedGood((prevState) => {
      setPrevGood(prevState);
      return {};
    });

    const deployments = props.digitalGoods.filter((good) =>
      Object.keys(good.locations.deploymentCountries).includes(code)
    );
    const developments = props.digitalGoods.filter((good) =>
      Object.keys(good.locations.developmentCountries).includes(code)
    );
    const countryName = props.countries[code].name;
    // set country name in searchbox
    searchRef.current.changeInput(countryName);
    // count sdgs for each country
    const sdgsDeploymentsInfo = Object.entries(
      deployments
        .reduce(
          (accum, curr) => [
            ...accum,
            ...curr.SDGs.map((sdg) => {
              return sdg.SDGNumber;
            }),
          ],
          []
        )
        .reduce(
          (acc, curr) => {
            return acc[curr] ? ++acc[curr]["dpgs"] : (acc[curr]["dpgs"] = 1), acc;
          },
          //initial value helps us create all elements of object
          {...sdgsDefault()}
        )
    );
    // count types of dpgs for each country
    const typeDeploymentsInfo = Object.entries(
      deployments
        .reduce((accum, curr) => [...accum, ...curr.type.map((type) => type)], [])
        .reduce(
          (acc, curr) => {
            return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
          },
          //initial value helps us create all elements of object
          {content: 0, data: 0, software: 0, standard: 0, "AI model": 0}
        )
    );

    setZoom(6);
    setLonLat([props.countries[code].lon, props.countries[code].lat]);
    setSelectedCountry({
      deployments: deployments,
      developments: developments,
      pathfinder: props.countries[code].pathfinder,
      name: countryName,
      sdgsDeployments: sdgsDeploymentsInfo,
      typeDeployments: typeDeploymentsInfo,
    });
    ref.current.clearStatesFromParent();
    searchRef.current.changeInput(countryName);
    width < 1008 && ref.current.scrollFromMap();
  };
  const handleSelectGoodPopup = (goodName) => {
    setSelectedGood((prevState) => {
      setPrevGood(prevState);
      return props.digitalGoods.filter(
        (el) => el.name.toLowerCase().indexOf(goodName.toLowerCase()) !== -1
      )[0]; // filter and grab 1st result
    });
    setSelectedCountry({});
    searchRef.current.changeInput(goodName);
  };

  const handleChangeSearchbox = (good) => {
    setSelectedGood((prevState) => {
      setPrevGood(prevState);
      return good;
    });
    setSelectedCountry({});
    ref.current.clearStatesFromParent();
  };
  const handleLayerToggle = (layer) => {
    setVisibleLayer((prevState) => ({...prevState, [layer]: !prevState[layer]}));
  };
  const handleClearSearchbox = () => {
    setSelectedGood((prevState) => {
      setPrevGood(prevState);
      return {};
    });
    setSelectedCountry({});
    ref.current.clearStatesFromParent();
  };
  const handleScrollToBottom = () => {
    width < 1008
      ? ref.current.scrollFromParent()
      : mainRef.current.scrollIntoView(false, {
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
  };

  return (
    <div ref={mainRef}>
      <div className={loading ? "whiteBack" : "inactive"}>
        <img className={"loader"} src={dpgaLogo}></img>
      </div>
      <div className="map">
        <div className={mapInteractive ? "mapContainer right" : "mapContainer"}>
          {mapInteractive && width < 1008 && (
            <SearchBox
              ref={searchRef}
              goods={props.digitalGoods}
              countries={props.countries}
              onSelectCountry={handleSelectCountry}
              selectedGood={selectedGood.name}
              selectedCountry={selectedCountry.name}
              onSelectGood={handleChangeSearchbox}
              clearSelectedGood={handleClearSearchbox}
            />
          )}
          {props.story.length && props.story[currentStepIndex].image != "false" && (
            <img className="stepImage" src={props.story[currentStepIndex].imageUrl} />
          )}
          <Map
            style="mapbox://styles/rolikasi/ckn67a95j022m17mcqog82g05"
            center={
              mapInteractive
                ? lonLat
                : [
                    parseFloat(props.story[currentStepIndex].longitude),
                    parseFloat(props.story[currentStepIndex].latitude),
                  ]
            }
            zoom={
              mapInteractive ? [zoom] : [parseFloat(props.story[currentStepIndex].zoom)]
            }
            pitch={
              visibleLayer["DPGs developed"] || visibleLayer["DPGs deployed"] ? 60 : 0
            } // pitch in degrees
            containerStyle={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              right: 0,
            }}
            className={mapInteractive ? "enabled" : "disabled"}
            movingMethod="flyTo"
            onDragEnd={(map, eventData) => {
              if (mapInteractive) {
                setLonLat([map.getCenter().lng, map.getCenter().lat]);
              }
            }}
            onZoomEnd={(map, eventData) => {
              if (mapInteractive) {
                setZoom(map.getZoom());
              }
            }}
            onStyleLoad={(map) => {
              var layers = map.getStyle().layers;
              // Find the index of the first symbol layer in the map style
              var firstSymbolId;
              for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === "symbol") {
                  firstSymbolId = layers[i].id;
                  break;
                }
              }
              let hardwareImg = new Image(20, 20);
              hardwareImg.onload = () => map.addImage("hardware-pattern", hardwareImg);
              hardwareImg.src = hardwarePattern;
              //add layer for each good with map
              props.digitalGoods.map((good) => {
                // check if layer is already created
                if (map.getLayer(good.name + "-develop")) {
                  console.log(good.name + " is layer already created");
                  return;
                } else {
                  map.addLayer(
                    {
                      id: good.name + "-develop",
                      source: {
                        type: "vector",
                        url: "mapbox://rolikasi.2kn4jvyh",
                      },
                      "source-layer": "ne_10m_admin_0_countries-dxlasx",
                      type: "fill",
                      paint: {
                        // 'fill-color': '#db3d44', // this is the color you want your tileset to have (red)
                        "fill-pattern": "hardware-pattern", //this helps us distinguish individual countries a bit better by giving them an outline
                      },
                    },
                    firstSymbolId
                  );
                  map.setLayoutProperty(good.name + "-develop", "visibility", "none");

                  map.setFilter(
                    good.name + "-develop",
                    ["in", "ADM0_A3_IS"].concat(
                      Object.keys(good.locations.developmentCountries)
                    )
                  ); // This line lets us filter by country codes.

                  map.addLayer(
                    {
                      id: good.name + "-deploy",
                      source: {
                        type: "vector",
                        url: "mapbox://rolikasi.2kn4jvyh",
                      },
                      "source-layer": "ne_10m_admin_0_countries-dxlasx",
                      type: "fill",
                      paint: {
                        // 'fill-color': '#db3d44', // this is the color you want your tileset to have (red)
                        "fill-color": "#3333AB", //this helps us distinguish individual countries a bit better by giving them an outline
                        "fill-opacity": 0.2,
                      },
                    },
                    firstSymbolId
                  );
                  map.setLayoutProperty(good.name + "-deploy", "visibility", "none");

                  map.setFilter(
                    good.name + "-deploy",
                    ["in", "ADM0_A3_IS"].concat(
                      Object.keys(good.locations.deploymentCountries)
                    )
                  ); // This line lets us filter by country codes.
                }
              });

              // Declare the image
              if (map.getLayer("Pathfinders Exploratory")) {
                console.log("Pathfinders Exploratory is layer already created");
                return;
              } else {
                let exploratoryImg = new Image(20, 20);
                exploratoryImg.onload = () =>
                  map.addImage("exploratory-pattern", exploratoryImg);
                exploratoryImg.src = exploratoryPattern;

                // Use it
                map.addLayer(
                  {
                    // adding a layer containing the tileset with country boundaries
                    id: "Pathfinders Exploratory", //this is the name of our layer, which we will need later
                    source: {
                      type: "vector",
                      url: "mapbox://rolikasi.2kn4jvyh",
                    },
                    "source-layer": "ne_10m_admin_0_countries-dxlasx",
                    type: "fill",
                    paint: {
                      "fill-pattern": "exploratory-pattern",
                      "fill-opacity": 0.5,
                    },
                    layout: {
                      visibility: "none",
                    },
                  },
                  firstSymbolId
                );

                map.setFilter(
                  "Pathfinders Exploratory",
                  ["in", "ADM0_A3_IS"].concat(Object.keys(props.pathfinderExploratory))
                ); // This line lets us filter by country codes.
              }

              if (map.getLayer("Pathfinders Confirmed")) {
                console.log("Pathfinders Confirmed layer is already created");
                return;
              } else {
                // Declare the image
                let confirmedImg = new Image(20, 20);
                confirmedImg.onload = () =>
                  map.addImage("confirmed-pattern", confirmedImg);
                confirmedImg.src = confirmedPattern;

                // Use it
                map.addLayer(
                  {
                    // adding a layer containing the tileset with country boundaries
                    id: "Pathfinders Confirmed", //this is the name of our layer, which we will need later
                    source: {
                      type: "vector",
                      url: "mapbox://rolikasi.2kn4jvyh",
                    },
                    "source-layer": "ne_10m_admin_0_countries-dxlasx",
                    type: "fill",
                    paint: {
                      "fill-pattern": "confirmed-pattern",
                      "fill-opacity": 0.5,
                    },
                    layout: {
                      visibility: "none",
                    },
                  },
                  firstSymbolId
                );

                map.setFilter(
                  "Pathfinders Confirmed",
                  ["in", "ADM0_A3_IS"].concat(Object.keys(props.pathfinderConfirmed))
                ); // This line lets us filter by country codes.
              }

              if (map.getLayer("countries")) {
                console.log("countries layer is already created");
                return;
              } else {
                map.addLayer(
                  {
                    // adding a layer containing the tileset with country boundaries
                    id: "countries", //this is the name of our layer, which we will need later
                    source: {
                      type: "vector",
                      url: "mapbox://rolikasi.2kn4jvyh",
                    },
                    "source-layer": "ne_10m_admin_0_countries-dxlasx",
                    type: "fill",
                    paint: {
                      "fill-color": "white", //this helps us distinguish individual countries a bit better by giving them an outline
                      "fill-opacity": 0,
                    },
                  },
                  firstSymbolId
                );

                map.setFilter(
                  "countries",
                  ["in", "ADM0_A3_IS"].concat(Object.keys(props.countries))
                ); // This line lets us filter by country codes.
                console.log('map.getLayer("countries")', map.getLayer("countries"));

                // Add 3d layer with extrudes
                map.addSource("DPGs developed-polygons-source", {
                  type: "geojson",
                  data: props.devPolygons,
                });
                map.addSource("DPGs deployed-polygons-source", {
                  type: "geojson",
                  data: props.depPolygons,
                });

                map.addLayer({
                  id: "DPGs developed",
                  source: "DPGs developed-polygons-source",
                  type: "fill-extrusion",
                  paint: {
                    "fill-extrusion-color": "#FF952A",
                    "fill-extrusion-height": ["get", "height"],
                    "fill-extrusion-base": ["get", "base"],
                  },
                  layout: {
                    visibility: "none",
                  },
                });

                map.addLayer({
                  id: "DPGs deployed",
                  source: "DPGs deployed-polygons-source",
                  type: "fill-extrusion",
                  paint: {
                    "fill-extrusion-color": "#3333AB",
                    "fill-extrusion-height": ["get", "height"],
                    "fill-extrusion-base": ["get", "base"],
                  },
                  layout: {
                    visibility: "none",
                  },
                });
                ["DPGs deployed", "DPGs developed"].map((layer, i) =>
                  map.addLayer({
                    id: `${layer}-text`,
                    source: `${layer}-polygons-source`,
                    type: "symbol",
                    paint: {
                      "text-color": ["#3333AB", "#FF952A"][i],
                      "text-halo-color": "#fff",
                      "text-halo-width": 1,
                    },
                    layout: {
                      "text-field": ["get", "text-field"],
                      "text-size": ["interpolate", ["linear"], ["zoom"], 4.5, 0, 5, 16],
                      "text-offset": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        4.5,
                        ["literal", [0, 0.5]],
                        9,
                        ["literal", [0, 3]],
                      ],
                      visibility: "none",
                    },
                  })
                );
                setLoading(false);
                // set map so we can resize() it in future from anywhere
                setMapInstance(map);

                // set country info when clicked on country with any data
                map.on("click", "countries", function (mapElement) {
                  handleSelectCountry(mapElement.features[0].properties.ADM0_A3_IS);
                });
                map.on("mouseenter", "countries", () => {
                  map.getCanvas().style.cursor = "pointer";
                });
                map.on("mouseleave", "countries", () => {
                  map.getCanvas().style.cursor = "";
                });
              }
            }}
          >
            <ZoomControl position="bottom-right" />
            <MapContext.Consumer>
              {(map) => {
                Object.keys(visibleLayer).map((layer) => {
                  console.log("toggle ", layer, " visibility");
                  map.getLayer(layer)
                    ? map.setLayoutProperty(
                        layer,
                        "visibility",
                        visibleLayer[layer] ? "visible" : "none"
                      )
                    : null;

                  // toggle text layer for 3d visualizations
                  if (["DPGs developed", "DPGs deployed"].includes(layer)) {
                    map.getLayer(layer + "-text")
                      ? map.setLayoutProperty(
                          layer + "-text",
                          "visibility",
                          visibleLayer[layer] ? "visible" : "none"
                        )
                      : null;
                  }
                });

                if (prevGood.name) {
                  console.log("toggle prevgood visibility");
                  map.setLayoutProperty(prevGood.name + "-develop", "visibility", "none");
                  map.setLayoutProperty(prevGood.name + "-deploy", "visibility", "none");
                }
                if (selectedGood.name) {
                  console.log("toggle selected good visibility");
                  map.setLayoutProperty(
                    selectedGood.name + "-develop",
                    "visibility",
                    "visible"
                  );
                  map.setLayoutProperty(
                    selectedGood.name + "-deploy",
                    "visibility",
                    "visible"
                  );
                }
              }}
            </MapContext.Consumer>
          </Map>
        </div>
        <InView
          as="div"
          onChange={(inView) => {
            setMapInteractive(!inView);
            if (mapInstance) mapInstance.resize();
          }}
        >
          <div className="scroller">
            <Scrollama onStepEnter={onStepEnter} offset="0.7">
              {props.story.map((_, stepIndex) => (
                <Step data={stepIndex} key={stepIndex}>
                  <div
                    className={`scrolly-p ${stepIndex == 0 ? "first" : ""} ${
                      stepIndex == props.story.length - 1 ? "last" : ""
                    }`}
                  >
                    <p>{_.text}</p>
                    {stepIndex == 0 && (
                      <div>
                        <p>
                          Scroll down to see the story or skip it and{" "}
                          <span className="button" onClick={handleScrollToBottom}>
                            explore the map
                          </span>
                        </p>

                        <div className="scrollArrows">
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                  </div>
                </Step>
              ))}
            </Scrollama>
          </div>
        </InView>

        <div
          className={
            selectedGood.name && props.story[currentStepIndex].image == "false"
              ? "map-overlay active"
              : "map-overlay"
          }
          id="legend"
        >
          <div className="legendContainer">
            {legends.map((legend, index) => (
              <div key={legend + index}>
                <span
                  className="legend-key"
                  style={
                    index == 0
                      ? {backgroundImage: `url(${hardwarePattern})`}
                      : {backgroundColor: colors[index]}
                  }
                ></span>
                <span>{legend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {mapInteractive && width >= 1008 && (
        <InfoComponent
          selectedGood={selectedGood}
          selectedCountry={selectedCountry}
          onSelectGood={handleSelectGoodPopup}
          onSelectCountry={handleSelectCountry}
          onLayerToggle={handleLayerToggle}
          visibleLayer={visibleLayer}
          ref={ref}
          SearchBox={
            <SearchBox
              ref={searchRef}
              goods={props.digitalGoods}
              countries={props.countries}
              onSelectCountry={handleSelectCountry}
              selectedGood={selectedGood.name}
              selectedCountry={selectedCountry.name}
              onSelectGood={handleChangeSearchbox}
              clearSelectedGood={handleClearSearchbox}
            />
          }
        />
      )}
      {width < 1008 && (
        <InfoComponent
          selectedGood={selectedGood}
          selectedCountry={selectedCountry}
          onSelectGood={handleSelectGoodPopup}
          onSelectCountry={handleSelectCountry}
          visibleLayer={visibleLayer}
          onLayerToggle={handleLayerToggle}
          ref={ref}
        />
      )}
    </div>
  );
}
