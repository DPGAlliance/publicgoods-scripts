import React, {useState} from 'react';
import {FilterCounter} from './FilterCounter';
import {SdgFilter} from './SdgFilter';
import {TypeFilter} from './TypeFilter';
import {StatusFilter} from './StatusFilter';
import {sdgs, types, stage} from "./filterValues";

export function Filters({nominees, displayNominees, setDisplayNominees}) {

  const [displayStatusFilter, setDisplayStatusFilter] = useState(stage);
  const [displayTypeFilter, setDisplayTypeFilter] = useState(types);
  const [displaySdgFilter, setDisplaySdgFilter] = useState(sdgs);

  const props = {
    nominees, displayNominees, setDisplayNominees,  displayStatusFilter, setDisplayStatusFilter,  displayTypeFilter, setDisplayTypeFilter,  displaySdgFilter, setDisplaySdgFilter
  }

  return (
    <div>
      <FilterCounter displayNominees={displayNominees} nominees={nominees}/>
      <StatusFilter {...props} />
      <TypeFilter {...props} />
      <SdgFilter {...props} />
    </div>
  );
}