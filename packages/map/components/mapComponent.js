import React, {useState, useRef, useEffect} from "react";
import ReactMapboxGl, {ZoomControl, MapContext} from "react-mapbox-gl";
import confirmedPattern from "../public/confirmed.svg";
// import exploratoryPattern from "../public/exploratory.svg";
import hardwarePattern from "../public/hardware.svg";
import {Scrollama, Step} from "react-scrollama";
import {InView} from "react-intersection-observer";
import SearchBox from "./searchBox";
import InfoComponent from "./infoComponent";
import UseWindowDimensions from "./UseWindowDimensions";
import dpgaLogo from "../public/logo.svg";
import NextImage from "next/image";

const layerStyles = {
  // "Pathfinders Exploratory": {
  //   backgroundImage: `url(${exploratoryPattern})`,
  // },

  "DPG Pathfinders": {
    backgroundImage: `url(${confirmedPattern})`,
  },
  "DPGs Developed": {
    backgroundColor: "#FF952A",
  },
  "DPGs Deployed": {
    backgroundColor: "#3333AB",
  },
};
const legends = ["where DPG was developed", "where DPG was deployed"];
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
const Map = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  maxZoom: 9,
  minZoom: 0,
  logoPosition: "bottom-right",
  pitchWithRotate: false,
});

export default function MapComponent(props) {
  const [selectedSdg, setSelectedSdg] = useState({});
  const [mapInstance, setMapInstance] = useState();
  const ref = useRef();
  const mainRef = useRef();
  const searchRef = useRef();
  const lastCard = useRef();
  const {width} = UseWindowDimensions();
  const [zoom, setZoom] = useState(zoomDefault);
  const [lonLat, setLonLat] = useState([props.lon, props.lat]);
  const [selectedGood, setSelectedGood] = useState({});
  const [selectedCountry, setSelectedCountry] = useState({});
  const [prevGood, setPrevGood] = useState({});
  const [visibleLayer, setVisibleLayer] = useState({
    // "Pathfinders Exploratory": false,
    "DPG Pathfinders": false,
    "DPGs Deployed": false,
    "DPGs Developed": false,
  });
  const [showMenu, setShowMenu] = useState();
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
      setSelectedCountry({});
      setSelectedSdg({});
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
    if (props.story[data].highlightMenu) {
      setShowMenu(props.story[data].highlightMenu);
    } else {
      setShowMenu(false);
    }
    // Check and set visible layer from gsheet
    if (props.story[data].showFilter) {
      let newVisibleLayer = {};
      Object.keys(visibleLayer).forEach(
        (v) =>
          (newVisibleLayer[v] = props.story[data].showFilter
            .toLowerCase()
            .includes(v.toLowerCase()))
      );
      setVisibleLayer(newVisibleLayer);
    } else {
      setVisibleLayer({
        // "Pathfinders Exploratory": false,
        "DPG Pathfinders": false,
        "DPGs Deployed": false,
        "DPGs Developed": false,
      });
    }
    searchRef.current && searchRef.current.changeInput(props.story[data].showDPG);
  };
  
  const handleSelectCountry = (code) => {
    // this line of code checks if (code) is country name
    if (!props.countries[code]) {
      code = Object.values(props.countries).filter(country => country.name === code)[0].code
    }
    setSelectedGood((prevState) => {
      setPrevGood(prevState);
      return {};
    });
    setSelectedSdg({});
    
    const deployments = props.digitalGoods.filter((good) =>
      Object.keys(good.locations.deploymentCountries).includes(code)
    );
    const developments = props.digitalGoods.filter((good) =>
      Object.keys(good.locations.developmentCountries).includes(code)
    );
    const countryName = props.countries[code].name;
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
          {content: 0, data: 0, software: 0, standard: 0, aimodel: 0}
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
    // set country name in searchbox
    searchRef.current.changeInput(countryName);
    width < 1008 && ref.current.scrollFromMap();
  };
  const handleSelectSdg = (sdg) => {
    // check if sdg is number of sdg
    if (typeof(sdg) == 'number') {
      sdg = props.SDGs.filter(el => el.number == sdg)[0]
    }
    setSelectedSdg(sdg);
    setSelectedCountry({});
    setSelectedGood((prevState) => {
      setPrevGood(prevState);
      return {};
    });
    searchRef.current.changeInput(sdg.name);
  };
  const handleSelectGood = (good) => {
    setSelectedGood((prevState) => {
      setPrevGood(prevState);
      if (typeof good == "object") {
        searchRef.current.changeInput(good.name);
        return good;
      }
      if (typeof good == "string") {
        searchRef.current.changeInput(good);
        return props.digitalGoods.filter(
          (el) => el.name.toLowerCase().indexOf(good.toLowerCase()) !== -1
        )[0]; // filter and grab 1st result;
      }
    });
    setSelectedCountry({});
    setSelectedSdg({});
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
    setSelectedSdg({});
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

  const handleScrollToStory = () => {
    setShowMenu(false);
    setMapInteractive(false);
  };

  useEffect(() => {
    setTimeout(() => {
      mapInteractive && handleScrollToBottom();
      if (mapInstance) mapInstance.resize();
    }, 100);
  }, [mapInteractive]);

  return (
    <div ref={mainRef} className="visContainer">
      <div className={loading ? "whiteBack" : "inactive"}>
        <div className="loader">
          <NextImage src={dpgaLogo} layout="fill" alt="Loading" />
        </div>
      </div>
      <div className="map">
        <div className={mapInteractive ? "mapContainer interactive" : "mapContainer"}>
          {(mapInteractive || showMenu == "searchbox") && width < 1008 && (
            <SearchBox
              ref={searchRef}
              goods={props.digitalGoods}
              countries={props.countries}
              onSelectCountry={handleSelectCountry}
              onSelectGood={handleSelectGood}
              clearSelectedGood={handleClearSearchbox}
              scrollToStory={handleScrollToStory}
              highlight={!mapInteractive && showMenu}
              mapInteractive={mapInteractive}
              onSelectSdg={handleSelectSdg}
              sdgs={props.SDGs}
              selectedValue={
                selectedCountry.name || selectedGood.name || selectedSdg.name
              }
            />
          )}
          {props.story.length &&
            props.story[currentStepIndex].image != "false" &&
            !mapInteractive && (
              <div className="stepImage">
                <NextImage
                  layout="fill"
                  objectFit="cover"
                  src={props.story[currentStepIndex].imageUrl}
                  alt="stepImage"
                />
              </div>
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
              visibleLayer["DPGs Developed"] || visibleLayer["DPGs Deployed"] ? [60] : [0]
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
              props.SDGs.map((sdg) => {
                if (map.getLayer(sdg.name)) {
                  console.log(sdg.name + " layer is already created");
                  return;
                } else {
                  map.addLayer(
                    {
                      id: sdg.name,
                      source: {
                        type: "vector",
                        url: "mapbox://rolikasi.2kn4jvyh",
                      },
                      "source-layer": "ne_10m_admin_0_countries-dxlasx",
                      type: "fill",
                      paint: {
                        "fill-color": "#83BEF6",
                        "fill-opacity": [
                          "get",
                          ["get", "ADM0_A3_IS"],
                          ["literal", sdg.opacity],
                        ],
                      },
                    },
                    firstSymbolId
                  );
                  map.setLayoutProperty(sdg.name, "visibility", "none");

                  map.setFilter(
                    sdg.name,
                    ["in", "ADM0_A3_IS"].concat(Object.keys(sdg.opacity))
                  );
                }
              });

              // Declare the image
              // if (map.getLayer("Pathfinders Exploratory")) {
              //   console.log("Pathfinders Exploratory is layer already created");
              //   return;
              // } else {
              //   let exploratoryImg = new Image(20, 20);
              //   exploratoryImg.onload = () =>
              //     map.addImage("exploratory-pattern", exploratoryImg);
              //   exploratoryImg.src = exploratoryPattern;

              //   // Use it
              //   map.addLayer(
              //     {
              //       // adding a layer containing the tileset with country boundaries
              //       id: "Pathfinders Exploratory", //this is the name of our layer, which we will need later
              //       source: {
              //         type: "vector",
              //         url: "mapbox://rolikasi.2kn4jvyh",
              //       },
              //       "source-layer": "ne_10m_admin_0_countries-dxlasx",
              //       type: "fill",
              //       paint: {
              //         "fill-pattern": "exploratory-pattern",
              //         "fill-opacity": 0.5,
              //       },
              //       layout: {
              //         visibility: "none",
              //       },
              //     },
              //     firstSymbolId
              //   );

              //   map.setFilter(
              //     "Pathfinders Exploratory",
              //     ["in", "ADM0_A3_IS"].concat(Object.keys(props.pathfinderExploratory))
              //   ); // This line lets us filter by country codes.
              // }

              if (map.getLayer("DPG Pathfinders")) {
                console.log("DPG Pathfinders layer is already created");
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
                    id: "DPG Pathfinders", //this is the name of our layer, which we will need later
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
                  "DPG Pathfinders",
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

                // Add 3d layer with extrudes
                map.addSource("DPGs Developed-polygons-source", {
                  type: "geojson",
                  data: props.devPolygons,
                });
                map.addSource("DPGs Deployed-polygons-source", {
                  type: "geojson",
                  data: props.depPolygons,
                });

                map.addLayer({
                  id: "DPGs Developed",
                  source: "DPGs Developed-polygons-source",
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
                  id: "DPGs Deployed",
                  source: "DPGs Deployed-polygons-source",
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
                ["DPGs Deployed", "DPGs Developed"].map((layer, i) =>
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
                  map.getLayer(layer)
                    ? map.setLayoutProperty(
                        layer,
                        "visibility",
                        visibleLayer[layer] ? "visible" : "none"
                      )
                    : null;

                  // toggle text layer for 3d visualizations
                  if (["DPGs Developed", "DPGs Deployed"].includes(layer)) {
                    map.getLayer(layer + "-text")
                      ? map.setLayoutProperty(
                          layer + "-text",
                          "visibility",
                          visibleLayer[layer] ? "visible" : "none"
                        )
                      : null;
                  }
                });
                props.SDGs.map((sdg) => {
                  if (map.getLayer(sdg.name)) {
                    selectedSdg.name == sdg.name
                      ? map.setLayoutProperty(selectedSdg.name, "visibility", "visible")
                      : map.setLayoutProperty(sdg.name, "visibility", "none");
                  }
                });

                if (prevGood.name) {
                  map.setLayoutProperty(prevGood.name + "-develop", "visibility", "none");
                  map.setLayoutProperty(prevGood.name + "-deploy", "visibility", "none");
                }
                if (selectedGood.name) {
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
        {!mapInteractive && (
          <InView
            as="div"
            onChange={(inView) => {
              if (mapInstance) mapInstance.resize();
              setMapInteractive(!inView);
              !inView && handleScrollToBottom();
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
                            <span
                              className="button"
                              onClick={() => setMapInteractive(true)}
                            >
                              explore the map
                            </span>
                          </p>

                          <div className="scrollArrows">
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      )}
                      {stepIndex == props.story.length - 1 && (
                        <span ref={lastCard}></span>
                      )}
                    </div>
                  </Step>
                ))}
              </Scrollama>
            </div>
          </InView>
        )}

        <div
          className={
            selectedSdg.maxDpgsInCountry ||
            selectedGood.name ||
            (Object.values(visibleLayer).some((item) => item) &&
              !mapInteractive &&
              props.story[currentStepIndex].image == "false")
              ? "map-overlay active"
              : "map-overlay"
          }
          id="legend"
        >
          <div className="legendContainer">
            {selectedGood.name &&
              legends.map((legend, index) => (
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
            {selectedSdg.name && (
              <div>
                <div className={"spaced"}>
                  <span>0</span>
                  <span className="legend-key gradient"></span>{" "}
                  <span>{selectedSdg.maxDpgsInCountry}</span>
                </div>
                <span>DPGs related to {selectedSdg.name}</span>
              </div>
            )}
            {!mapInteractive &&
              Object.entries(visibleLayer).map((layer, index) => {
                return (
                  layer[1] && (
                    <div key={layer[0] + index}>
                      <span
                        className="legend-key rectangle"
                        style={layerStyles[layer[0]]}
                      ></span>
                      <span>{layer[0]}</span>
                    </div>
                  )
                );
              })}
          </div>
        </div>
      </div>
      {(mapInteractive || showMenu) && width >= 1008 && (
        <InfoComponent
          selectedGood={selectedGood}
          selectedSdg={selectedSdg}
          selectedCountry={selectedCountry}
          onSelectGood={handleSelectGood}
          onSelectCountry={handleSelectCountry}
          onLayerToggle={handleLayerToggle}
          visibleLayer={visibleLayer}
          ref={ref}
          highlight={!mapInteractive && showMenu}
          summary={props.summary}
          onSelectSdg={handleSelectSdg}
          SearchBox={
            <SearchBox
              ref={searchRef}
              sdgs={props.SDGs}
              selectedValue={
                selectedCountry.name || selectedGood.name || selectedSdg.name
              }
              onSelectSdg={handleSelectSdg}
              goods={props.digitalGoods}
              countries={props.countries}
              onSelectCountry={handleSelectCountry}
              onSelectGood={handleSelectGood}
              clearSelectedGood={handleClearSearchbox}
              scrollToStory={handleScrollToStory}
              highlight={!mapInteractive && showMenu}
              mapInteractive={mapInteractive}
            />
          }
        />
      )}
      {width < 1008 && (
        <InfoComponent
          selectedGood={selectedGood}
          selectedSdg={selectedSdg}
          selectedCountry={selectedCountry}
          onSelectGood={handleSelectGood}
          onSelectCountry={handleSelectCountry}
          visibleLayer={visibleLayer}
          onLayerToggle={handleLayerToggle}
          onSelectSdg={handleSelectSdg}
          ref={ref}
          summary={props.summary}
        />
      )}
    </div>
  );
}
