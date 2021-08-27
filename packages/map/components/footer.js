import React from "react";

export default function Footer() {
  return (
    <div className="footer">
      {/* <a target="_blank" href="https://github.com/Rolikasi/digital-public-goods-map">
        Contribute
      </a>
      <a target="_blank" href="mailto:hello@digitalpublicgoods.net">Report issue</a> */}
      <span>
        Data:{" "}
        <a
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1t75gYVhdUjPD1532DbPYN49FLXFhpRwEBFiS4Hbk6_Q/edit#gid=728344896"
        >
          Pathfinders and Story
        </a>{" "}
        |{" "}
        <a target="_blank" href="https://github.com/unicef/publicgoods-candidates">
          DPGs
        </a>
      </span>
    </div>
  );
}
