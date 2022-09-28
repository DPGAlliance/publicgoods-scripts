import React from "react";

export function RegistryPastYearOfActivity({ item }) {
    return (
        <td><div dangerouslySetInnerHTML={{__html: item.githubActivity}} /></td>
    )
}