import React from 'react';
import { RegistryItem } from './RegistryItem';

export function RegistryList({nominees}) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>License</th>
          <th>Past year of activity</th>
        </tr>
      </thead>
      <tbody>
        {nominees.map((item, index) => (
          <RegistryItem item={item} index={index} key={index} />
        ))}
      </tbody>
    </table>
  )
}