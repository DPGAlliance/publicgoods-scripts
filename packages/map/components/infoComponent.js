import React, {useState, forwardRef, useImperativeHandle, useRef} from "react";
import {InView} from "react-intersection-observer";
import Footer from "./footer";
import confirmedPattern from "../public/confirmed.svg";
import InfoGood from "./infoGood";
import InfoCountry from "./infoCountry";
import InfoSdg from "./infoSdg";
import InfoSummary from "./infoSummary";
// import exploratoryPattern from "../public/exploratory.svg";

const buttonStyles = {
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
const InfoComponent = forwardRef((props, ref) => {
  const [menuInView, setMenuInView] = useState(false);
  const handleLayerToggle = (e, layer) => {
    e.preventDefault();
    e.stopPropagation();
    props.onLayerToggle(layer);
  };
  const divRef = useRef(null);
  const infoRef = useRef(null);
  const scrollHandle = () => {
    if (!menuInView) {
      divRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };
  const scrollToInfo = () => {
    infoRef.current.scrollIntoView({behavior: "smooth", block: "end"});
  };
  useImperativeHandle(ref, () => {
    return {
      scrollFromParent: scrollToInfo,
      scrollFromMap: scrollHandle,
    };
  });
  return (
    <div className={!props.highlight ? "infoGood" : "infoGood fixed"}>
      <div>{props.SearchBox}</div>
      <div className="controls" onClick={scrollHandle} ref={infoRef}>
        <span id="arrow-up" className={!menuInView ? "arrow up active" : "arrow up"} />
        <div
          id="hamburger"
          className={!menuInView ? "hamburger-icon" : "hamburger-icon active"}
        >
          <div className="bar1"></div>
        </div>
        <span>{menuInView ? "" : "Tap to see filters and info"}</span>
      </div>

      <ul
        ref={divRef}
        className={props.highlight == "filters" ? "filters highlight" : "filters"}
      >
        {Object.keys(props.visibleLayer).map((layer, index) => (
          <li id={layer} key={layer + index} onClick={(e) => handleLayerToggle(e, layer)}>
            <span>{props.visibleLayer[layer] ? layer : ""}</span>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={layer + (props.visibleLayer[layer] ? " active" : "")}
              style={
                props.visibleLayer[layer] ? buttonStyles[layer] : {background: "none"}
              }
            >
              {props.visibleLayer[layer] ? "" : layer}
            </a>
          </li>
        ))}
        <InView as="div" onChange={(inView) => setMenuInView(inView)}></InView>
      </ul>

      {Object.keys(props.selectedCountry).length != 0 && (
        <InfoCountry
          selectedCountry={props.selectedCountry}
          onSelectGood={props.onSelectGood}
          onSelectSdg={props.onSelectSdg}
        />
      )}
      {Object.keys(props.selectedGood).length != 0 && (
        <InfoGood
          selectedGood={props.selectedGood}
          onSelectCountry={props.onSelectCountry}
        />
      )}
      {Object.keys(props.selectedSdg).length > 0 &&
        props.selectedSdg.dpgCount.length > 0 && (
          <InfoSdg
            selectedSdg={props.selectedSdg}
            onSelectGood={props.onSelectGood}
            onSelectCountry={props.onSelectCountry}
          />
        )}
      {!Object.keys(props.selectedGood).length &&
        !Object.keys(props.selectedCountry).length &&
        !Object.keys(props.selectedSdg).length && (
          <InfoSummary summary={props.summary} onSelectSdg={props.onSelectSdg} />
        )}
      <Footer />
    </div>
  );
});
InfoComponent.displayName = "InfoComponent";
export default InfoComponent;
