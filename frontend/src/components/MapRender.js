import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
// import mapboxgl from "!mapbox-gl";
import "../css/maps.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const MapRender = () => {
  const mapContainerRef = useRef(null);
  let params = useParams();

  let location = useLocation();
  let latitude = 0;
  let longitude = 0;
  const [locationState, setLocationState] = useState({
    from: "",
    idx: "",
    storeAddress: "",
    latitude: "",
    longitude: "",
  });
  async function maprender() {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 9,
      hash: true,
    });

    const marker = new mapboxgl.Marker({
      color: "blue",
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => map.remove();
  }
  useEffect(() => {
    console.log("location from app", location.state);
    latitude = location.state["latitude"];
    longitude = location.state["longitude"];
    if (location.state) {
      setLocationState(location.state);
    }
    maprender();
  }, [location, mapContainerRef]);
  return (
    <div>
      <b style={{ marginLeft: "6rem" }}>Here is the location on Map</b>
      <p style={{ marginLeft: "6rem" }}>
        {" "}
        Store Address: {locationState.storeAddress}
      </p>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapRender;
