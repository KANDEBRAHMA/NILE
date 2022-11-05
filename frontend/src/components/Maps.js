import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef } from "react";
import "../css/maps.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Marker = ({ onClick, children, feature }) => {
  const _onClick = () => {
    onClick(feature.properties.description);
  };

  return <button onClick={_onClick}>{children}</button>;
};

const Map = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-87.6244212, 41.8755616],
      zoom: 12,
    });

    const sourceMarker = new mapboxgl.Marker()
      .setLngLat([-87.6244212, 41.8755616])
      .addTo(map);

    // Create a default Marker, colored black, rotated 45 degrees.
    const destinationMarker = new mapboxgl.Marker({ color: "black" })
      .setLngLat([-87.6930459, 42.0447388])
      .addTo(map);

    // Add navigation control (the +/- zoom buttons)
    // map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  const markerClicked = (title) => {
    window.alert(title);
  };

  return <div className="map" ref={mapContainerRef}></div>;
};

export default Map;
