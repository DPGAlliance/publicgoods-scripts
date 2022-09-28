import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { RegistryList } from './components/RegistryList';
import { Filters } from './components/Filters';



const App = () => {
  const [nominees] = useState(require('./nominees.json'));
  const [displayNominees, setDisplayNominees] = useState(nominees);

  return (
    <>
      <div id="sidebar">
        <div className="sidebar__inner" id="filters" style={{position: "relative"}}>
          <Filters nominees={nominees} displayNominees={displayNominees} setDisplayNominees={setDisplayNominees} />
        </div>
      </div>
      <div id="content" style={{marginLeft: "240px", minHeight:"700px"}}>
        <div id="mytable">
          <RegistryList nominees={displayNominees}/>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.querySelector('#main-content'));
