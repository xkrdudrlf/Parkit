import { useContext } from "react";
import CarSpaceModalContext from "../../../contexts/provider-modal-context";
import { Marker, Popup } from "react-leaflet";

const MapPointObject = ({ id, longitude, latitude, streetAddress }) => {
  const carSpaceModalContext = useContext(CarSpaceModalContext);

  const mapItemClickHandler = () => {
    carSpaceModalContext.openPage("/info", id);
  };

  return (
    <Marker
      position={[longitude, latitude]}
      eventHandlers={{
        click: mapItemClickHandler,
      }}
    >
      <Popup>{streetAddress}</Popup>
    </Marker>
  );
};

export default MapPointObject;
