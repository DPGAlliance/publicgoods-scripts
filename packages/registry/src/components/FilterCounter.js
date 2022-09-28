import React from 'react';

export function FilterCounter({ displayNominees, nominees }) {
  return (
    <div className="filterSection">
      <p>Displaying {displayNominees.length} of <b>{nominees.length}</b> items</p>
    </div>
  )
}