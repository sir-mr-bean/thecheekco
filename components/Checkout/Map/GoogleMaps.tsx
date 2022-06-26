import React, {
  Component,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

const shopMarker = [
  {
    lat: -16.921913551261635,
    lng: 145.77625914833033,
  },
];

const SimpleMap = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const shop = { lat: -16.921913551261635, lng: 145.77625914833033 };

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: shop,
          zoom: 18,
        })
      );
    }
  }, [ref, map]);

  return (
    <>
      <div ref={ref} className="w-full h-40" />
      {React.Children.map<ReactNode, ReactNode>(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

export default SimpleMap;
