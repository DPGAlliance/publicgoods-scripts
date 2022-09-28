import React, {useEffect} from 'react';
import Collapsible from 'react-collapsible';

export function TypeFilter({
                             nominees,
                             setDisplayNominees,
                             displayTypeFilter,
                             setDisplayTypeFilter,
                             displayStatusFilter,
                             displaySdgFilter
                           }) {

  const types = ["aimodel", "content", "data", "software", "standard"]
  const displayTypes = ["AI Model", "Content", "Data", "Software", "Standard"]

  useEffect(() => setDisplayNominees(filteredNominees), [displayTypeFilter]);

  function determineValue(item, index) {
    if (item === false) {
      return types[index]
    } else {
      return false
    }
  }

  const filteredNominees = nominees.filter(nominee => {
    const filteredStatusState = displayStatusFilter.filter(Boolean)
    const filteredTypeState = displayTypeFilter.filter(Boolean)
    const filtereSdgState = displaySdgFilter.filter(Boolean)
    const nomineeSdgArray = nominee.SDGs.map(item => item.SDGNumber);

    return filteredTypeState.filter(value => nominee.type.includes(value)).length > 0 &&
      filteredStatusState.filter(value => nominee.stage.includes(value)).length > 0 &&
      filtereSdgState.filter(value => nomineeSdgArray.includes(value)).length > 0;
  })

  const handleOnChange = (position) => {
    const updatedCheckedState = displayTypeFilter.map((item, index) =>
      index === position ? determineValue(item, index) : item
    );

    setDisplayTypeFilter(updatedCheckedState);
  };

  return (
    <Collapsible trigger="Type" open={true}>
      <div className="filterSection">
        <div className="filteredContent" id="sdg-options">
          {displayTypes.map((name, index) => {
            return (
              <div className="types-list-item" key={index}>
                <div className="left-section" style={{textAlign: "left"}}>
                  <input
                    type="checkbox"
                    id={`custom-type-checkbox-${index}`}
                    name={name}
                    value={index}
                    checked={displayTypeFilter[index]}
                    onChange={() => handleOnChange(index)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Collapsible>
  )
}