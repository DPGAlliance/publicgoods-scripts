import React from "react";

export function DpgBadge({ item }) {
    const normalizedName = item.name.normalize('NFD')
        .toLowerCase()
        .replace(/\s{2,}/g, ' ')
        .replace(/ /g, '-')
        .replace(/[^A-Za-z0-9-.]/g, '')
        .replace(/-{2,}/g, '-')

    if (item.stage === 'DPG') {
        if (item.dpgLink) {
            return (<a href={'/registry/' + normalizedName + '.html'}><img src="dpgicon.svg" alt="DPG icon" height="25" /></a>)
        } else {
            return (<a href="/blog/announcing-the-first-vetted-digital-public-goods-for-foundational-literacy-and-early-grade-reading/"><img src="dpgicon.svg" alt="DPG icon" height="25" /></a>)
        }
    }
    return null;
}