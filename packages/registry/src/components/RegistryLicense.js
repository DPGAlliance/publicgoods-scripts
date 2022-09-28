import React from 'react';

export function RegistryLicense({ item }) {
    const href = item.license.at(-1).licenseURL;
    const licenseName = item.license.at(-1).spdx;
    const license = <a href={href} target="_blank" rel="noopener noreferrer"> {licenseName} </a>
    return (
        <td className="license">{license}</td>
    )
}