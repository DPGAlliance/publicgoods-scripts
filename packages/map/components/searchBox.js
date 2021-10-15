import React, {forwardRef, useImperativeHandle, useState, useRef, useEffect} from "react";
import dpgBadge from "../public/dpgBadge.svg";
import UseWindowDimensions from "./UseWindowDimensions";
import Image from "next/image";

const SearchBox = forwardRef((props, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const textRef = useRef();
  const [inputValue, setInputValue] = useState(
    props.selectedValue ? props.selectedValue : ""
  );
  const {width} = UseWindowDimensions();
  const handleMouseOver = () => {
    !menuOpen && setMenuOpen(true);
  };
  const handleMouseLeave = () => {
    menuOpen && setMenuOpen(false);
  };
  const handleMenuClick = () => {
    !menuOpen && setMenuOpen(true);
  };
  const handleMenuSelect = () => {
    menuOpen && setMenuOpen(false);
  };
  const [searchFocused, setSearchFocused] = useState(false);
  const onFocus = () => setSearchFocused(true);
  const onBlur = () => setSearchFocused(false);
  const [tooltip, setTooltip] = useState({});
  const handleSelect = (item, event) => {
    event.preventDefault();
    // Here, we invoke the callback with the new value
    setInputValue(item.name);
    if (item.search == "dpg") {
      props.onSelectGood(item);
    }
    if (item.search == "sdg") {
      props.onSelectSdg(item);
    }
    if (item.search == "country") {
      props.onSelectCountry(item.code);
    }
  };
  const handleClear = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setInputValue("");
    props.clearSelectedGood();
  };
  const handleChangeInput = (event) => {
    setInputValue(event.target.value);
  };
  const handleInputSize = (element) => {
    element.style.height = "2rem";
    element.style.height = element.scrollHeight + "px";
  };
  const changeInput = (value) => {
    setInputValue(value);
  };
  useImperativeHandle(ref, () => {
    return {
      changeInput: changeInput,
    };
  });
  useEffect(() => {
    handleInputSize(textRef.current);
    // code to run after render goes here
  });

  return (
    <div
      className={
        props.highlight == "searchbox" ? "selectContainer highlight" : "selectContainer"
      }
    >
      <div
        onClick={handleMenuClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        id="dg-menu"
      >
        <textarea
          ref={textRef}
          onFocus={onFocus}
          onBlur={(e) => onBlur(e)}
          className="searchInput"
          type="text"
          value={inputValue}
          placeholder="Select a DPG, SDG or country"
          onChange={(e) => handleChangeInput(e)}
        ></textarea>
        <span
          className={menuOpen || searchFocused ? "arrow up active" : "arrow down active"}
        ></span>
        <div
          onClick={handleMenuSelect}
          onMouseLeave={handleMouseLeave}
          id="dg-menu-dropdown"
          className={menuOpen || searchFocused ? "active" : ""}
        >
          {[
            ...props.goods.sort((a, b) => a.name.localeCompare(b.name)),
            ...Object.values(props.sdgs),
            ...Object.values(props.countries).sort((a, b) =>
              a.name.localeCompare(b.name)
            ),
          ]
            .filter(
              (el) => el.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            )
            .map((item, index) => (
              <a key={item.name + index} href="#" onClick={(e) => handleSelect(item, e)}>
                {item.name}
                {item.search == "dpg" && width > 1008 && (
                  <Image width={45} height={24} src={dpgBadge} alt="dpg badge" />
                )}
              </a>
            ))}
        </div>
      </div>
      <div
        className="navIcon"
        onClick={(e) => handleClear(e)}
        onMouseOver={(e) => setTooltip({clear: true})}
        onMouseLeave={() => setTooltip({})}
      >
        <span>x</span>
        {tooltip.clear && <p className="searchTooltip">clear input</p>}
      </div>
      {props.mapInteractive && (
        <div
          className="navIcon"
          onClick={(e) => props.scrollToStory()}
          onMouseOver={() => setTooltip({back: true})}
          onMouseLeave={() => setTooltip({})}
        >
          <span className="arrow active up"></span>
          <span className="arrow active up"></span>
          {tooltip.back && <p className="searchTooltip">back to story</p>}
        </div>
      )}
    </div>
  );
});
export default SearchBox;
