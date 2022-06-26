import React, { Component } from "react";

const shopMarker = [
  {
    lat: -16.921913551261635,
    lng: 145.77625914833033,
  },
];

const SimpleMap = ({ children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();
  const shop = { lat: -16.921913551261635, lng: 145.77625914833033 };

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: shop,
          zoom: 18,
        })
      );
      // setTimeout(() => {
      //   handleDrawMarkers();
      // }, 2000);
    }
  }, [ref, map]);

  // const handleDrawMarkers = () => {
  //   shopMarker.forEach((marker) => {
  //     new google.maps.Marker({
  //       position: marker,
  //       map: map,
  //       icon: {
  //         url: "https://thecheekco.vercel.app/images/logo.png",
  //         scaledSize: new google.maps.Size(50, 50),
  //       },
  //     });
  //   });
  // };

  return (
    <>
      <div ref={ref} className="w-full h-40" />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // tslint:disable-next-line
          return React.cloneElement(child as React.ReactElement<any>, { map });
        }
      })}
    </>
  );
};

export default SimpleMap;
