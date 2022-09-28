import React from "react";
import { DpgBadge } from "./DpgBadge";

export function RegistryName({ item }) {

    const hasCode = item.repositories && item.repositories.length
    const getLink = (item) => {
        if (item.website) {
            return item.website
        } else if (hasCode) {
            return item.repositories[0].url
        } else {
            return null
        }
    }
    const link = getLink(item)

    const has_alias = item.aliases && item.aliases.length ? item.aliases[0] !== '' : false;
    const displayName = has_alias ? item.name + ' (' + item.aliases[0] + ')' : item.name;
    const name = link ? <a href={link}>{displayName}</a> : displayName;

    const sourceCode = hasCode ? 
    <><br/><a href={item.repositories[0].url} className="sourceLink" style={{ fontSize: "50%", fontWeight: "bold", marginTop:"10px"}}>View Source Code</a></> : null

    return (
        <td>{name}<DpgBadge item={item} /> {sourceCode}</td>
    )
}
