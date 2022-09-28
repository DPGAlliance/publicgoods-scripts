import React, {useEffect} from 'react';
import Collapsible from 'react-collapsible';

export function SdgFilter({
                            nominees,
                            setDisplayNominees,
                            displayStatusFilter,
                            displayTypeFilter,
                            displaySdgFilter,
                            setDisplaySdgFilter
                          }) {
  const sdgs = ["1. No Poverty", "2. Zero Hunger", "3. Good Health and Well-being", "4. Quality Education", "5. Gender Equality", "6. Clean Water and Sanitation", "7. Affordable and Clean Energy", "8. Decent Work and Economic Growth", "9. Industry, Innovation and Infrastructure", "10. Reduced Inequality", "11. Sustainable Cities and Communities", "12. Responsible Consumption and Production", "13. Climate Action", "14. Life Below Water", "15. Life on Land", "16. Peace and Justice Strong Institutions", "17. Partnerships to achieve the Goal"]

  useEffect(() => setDisplayNominees(filteredNominees), [displaySdgFilter]);

  const trunc = (str, len) => str.slice?.(0, len) + '...';

  function determineValue(item, index) {
    if (item === false) {
      return index + 1
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
    const updatedCheckedState = displaySdgFilter.map((item, index) =>
      index === position ? determineValue(item, index) : item
    );

    setDisplaySdgFilter(updatedCheckedState);
  };

  return (
    <Collapsible trigger="SDG" open={true}>
      <div className="filterSection">
        <div className="filteredContent" id="sdg-options">
          {sdgs.map((name, index) => {
            return (
              <div className="sdgs-list-item" key={index}>
                <div className="left-section" style={{textAlign: "left"}}>
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={index}
                    checked={displaySdgFilter[index]}
                    onChange={() => handleOnChange(index)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>                  {trunc(name, 25)}</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Collapsible>
  )
}