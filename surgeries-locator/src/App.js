import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import data from "./surgeries.json";
import "./App.css";
import SurgeryInfo from "./SurgeryInfo";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 51.5074,
  lng: -0.1278,
};

const options = {
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
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

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  const [map, setMap] = React.useState(null)


  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  console.log(isLoaded);

  console.log(selected);

  if (isLoaded) {
    const maps = window.google.maps;
    return (
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={1} options={options} onLoad={onLoad}
      >
        {data.features.map((item) => {
          const { category } = item.properties;
          let markerIcon = "";
          switch (category) {
            case "Doctors":
              markerIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
              break;
            case "Clinics":
              markerIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
              break;
            case "Hospitals":
              markerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
              break;
            default:
              markerIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
              break;
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
