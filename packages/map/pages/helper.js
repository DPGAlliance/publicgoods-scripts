import dynamic from "next/dynamic";
import React from "react";

export default function Helper() {
  const MapHelperComponent = dynamic(import("../components/mapHelperComponent"), {
    ssr: false,
  });
  return (
    <div className="main">
      <MapHelperComponent lon={-14} lat={24.5} />
    </div>
  );
}
