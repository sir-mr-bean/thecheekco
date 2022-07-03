import React, {
  Component,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const shopMarker = [
  {
    lat: -16.921913551261635,
    lng: 145.77625914833033,
  },
];

const containerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "10px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const SimpleMap = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const onLoad = React.useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const [map, setMap] = React.useState(null);
  const shop = { lat: -16.921913551261635, lng: 145.77625914833033 };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={shop}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      clickableIcons={false}
    >
      {children}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default SimpleMap;
