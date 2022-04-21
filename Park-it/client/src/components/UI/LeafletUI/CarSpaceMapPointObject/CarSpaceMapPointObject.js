import { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";

const CarSpaceMapPointObject = ({
  longitude,
  latitude,
  streetAddress,
  openPopup = false,
}) => {
  const markerRef = useRef();

  useEffect(() => {
    if (openPopup) markerRef.current.openPopup();
  });

  return (
    <Marker position={[longitude, latitude]} ref={markerRef}>
      <Popup>{streetAddress}</Popup>
    </Marker>
  );
};

export default CarSpaceMapPointObject;
