import { useEffect, useState } from "react";

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>();

  useEffect(() => {
    if (!marker) {
      setMarker(
        new google.maps.Marker({
          map: new google.maps.Map(document.createElement("div")),
          ...options,
        })
      );
    }
    //   position: marker,
    //   icon: {
    //     url: "https://thecheekco.vercel.app/images/logo.png",
    //     scaledSize: new google.maps.Size(50, 50),
    //   },
    // })
    //   );
    // }
    // remove marker from map on unmount
    return () => {
      if (marker) {
        setMarker(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

export default Marker;
