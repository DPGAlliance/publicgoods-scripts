import React, {forwardRef, useImperativeHandle, useState, useRef, useEffect} from "react";
import dpgBadge from "../public/dpgBadge.svg";
import UseWindowDimensions from "./UseWindowDimensions";

const SearchBox = forwardRef((props, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const textRef = useRef();
  const [inputValue, setInputValue] = useState(
    props.selectedGood
      ? props.selectedGood
      : props.selectedCountry
      ? props.selectedCountry
      : ""
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
  const handleSelect = (item, event) => {
    event.preventDefault();
    // Here, we invoke the callback with the new value
    setInputValue(item.name);
    props.onSelectGood(item);
  };
  const handleSelectCountry = (item, event) => {
    event.preventDefault();
    // Here, we invoke the callback with the new value
    setInputValue(item.name);
    props.onSelectCountry(item.code);
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
    <div className="selectContainer">
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
          placeholder="Select a digital good or country"
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
          {props.goods
            .filter(
              (el) => el.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item, index) => (
              <a key={item.name + index} href="#" onClick={(e) => handleSelect(item, e)}>
                {item.name}
                {width > 1008 && <img width="45px" height="auto" src={dpgBadge}></img>}
              </a>
            ))}
          {Object.values(props.countries)
            .filter(
              (el) => el.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item, index) => (
              <a
                key={item.name + index}
                href="#"
                onClick={(e) => handleSelectCountry(item, e)}
              >
                {item.name}
              </a>
            ))}
        </div>
      </div>
      <div className="closeIcon" onClick={(e) => handleClear(e)}>
        <span>x</span>
      </div>
    </div>
  );
});
export default SearchBox;
