import classes from "./CarSpaceMap.module.css";

import { MapContainer, TileLayer, useMap } from "react-leaflet";

import CarSpaceMapPointObject from "../CarSpaceMapPointObject/CarSpaceMapPointObject";

const CarSpaceMap = ({ center, zoom, items, children, selectedItemIdx }) => {
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  return (
    <div className={classes.mapContainer}>
      <MapContainer
        className={classes.mapContainer}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map((item) => {
          const openPopup = item.pk === selectedItemIdx;
          return (
            <CarSpaceMapPointObject
              key={item.pk}
              longitude={item.longitude}
              latitude={item.latitude}
              streetAddress={item.streetAddress}
              openPopup={openPopup}
            />
          );
        })}
      </MapContainer>
      {children}
    </div>
  );
};

export default CarSpaceMap;
