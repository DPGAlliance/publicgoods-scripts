import React, {useState} from "react";
import ReactMapboxGl, {ZoomControl} from "react-mapbox-gl";
const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_TOKEN,
  maxZoom: 9,
  minZoom: 0,
  logoPosition: "bottom-right",
  pitchWithRotate: false,
});
const zoomDefault = 2;
export default function MapHelperComponent(props) {
  const [zoom, setZoom] = useState(zoomDefault);
  const [lonLat, setLonLat] = useState([props.lon, props.lat]);
  const [pitch, setPitch] = useState(false);
  const handlePitch = () => setPitch(!pitch);
  return (
    <div>
      <Map
        style="mapbox://styles/rolikasi/ckn67a95j022m17mcqog82g05"
        center={lonLat}
        zoom={[zoom]}
        pitch={pitch ? 60 : 0} // pitch in degrees
        containerStyle={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
        }}
        movingMethod="flyTo"
        onMoveEnd={(map) => {
          setLonLat([map.getCenter().lng, map.getCenter().lat]);
          console.log(map.getCenter().lng, map.getCenter().lat);
        }}
        onZoomEnd={(map) => {
          setZoom(map.getZoom());
          console.log("zoom", map.getZoom());
        }}
      >
        <ZoomControl />
      </Map>
      <div className="helper-overlay">
        <p>Longitude: {lonLat[0].toFixed(2)}</p>
        <p>Latitude: {lonLat[1].toFixed(2)}</p>
        <p>Zoom: {zoom.toFixed(2)}</p>
        <button onClick={handlePitch}>Pitch Map</button>
      </div>
    </div>
  );
}
