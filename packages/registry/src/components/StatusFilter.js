import React, {useEffect} from 'react';
import Collapsible from 'react-collapsible';

export function StatusFilter({
                               nominees,
                               setDisplayNominees,
                               displayStatusFilter,
                               setDisplayStatusFilter,
                               displayTypeFilter,
                               displaySdgFilter
                             }) {
  const stage = ["nominee", "DPG"];
  const displayStage = ["nominee", 'digital public good']

  useEffect(() => setDisplayNominees(filteredNominees), [displayStatusFilter]);

  function determineValue(item, index) {
    if (item === false) {
      return stage[index]
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
    const updatedCheckedState = displayStatusFilter.map((item, index) =>
      index === position ? determineValue(item, index) : item
    );

    setDisplayStatusFilter(updatedCheckedState);
  };

  return (
    <Collapsible trigger="Stage" open={true}>
      <div className="filterSection">
        <div className="filteredContent" id="sdg-options">
          {displayStage.map((name, index) => {
            return (
              <div className="stage-list-item" key={index}>
                <div className="left-section" style={{textAlign: "left"}}>
                  <input
                    type="checkbox"
                    id={`custom-stage-checkbox-${index}`}
                    name={name}
                    value={index}
                    checked={displayStatusFilter[index]}
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