import React from 'react';
import { RegistryDescription } from './RegistryDescription';
import { RegistryLicense } from './RegistryLicense';
import { RegistryName } from './RegistryName';
import { RegistryPastYearOfActivity } from './RegistryPastYearOfActivity';

export function RegistryItem(nominee) {
    const item = nominee.item;
    const index = nominee.index;

    return (
        <tr key={index}>
            <RegistryName item={item} />
            <RegistryDescription item={item} />
            <RegistryLicense item={item} />
            <RegistryPastYearOfActivity item={item} />
        </tr>
    )

}
