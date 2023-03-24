import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import data from "./practices_new.json";
import "./App.css";
import SurgeryInfo from "./SurgeryInfo";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 53.8008,
  lng: -1.5491
};

const options = {
  disableDefaultUI: true,
  zoomControl: true
};

export default function App() {
  const [selected, setSelected] = useState(null);

  const onSelect = (item) => {
    setSelected(item);
  };

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  const apiKey = '';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  const [maps, setMaps] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      window.gm_authFailure = () => {
        console.error('Google Maps API authentication error');
      };

      window.initMap = () => {
        setMaps(window.google.maps);
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isLoaded]);

  const onLoad = useCallback(function callback(map) {
    setMaps(window.google.maps);
  }, [])

  if (isLoaded && maps && data != null) {
    return (
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11} options={options} onLoad={onLoad}
      >
        {data.features.map((item) => {
          const { Party } = item.properties;
          let markerIcon = "";

          if (Party.includes("Labour")) {
            markerIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
          }
          else if (Party.includes("Conservative")) {
            markerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
          }
          else {
            markerIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
          }
          return (
            <Marker
              key={item.properties.PMSCode}
              position={{
                lat: item.geometry.coordinates[1],
                lng: item.geometry.coordinates[0],
              }}
              onClick={() => {
                onSelect(item);
              }}
              icon={{
                url: markerIcon,
                scaledSize: maps.Size(40, 40),
                origin: maps.Point(0, 0),
                anchor: maps.Point(20, 20),
              }}
            />
          );
        })}
        {selected && <SurgeryInfo selected={selected} setSelected={setSelected} />}
      </GoogleMap>
    )
  } else {
    return <></>;
  }
}
