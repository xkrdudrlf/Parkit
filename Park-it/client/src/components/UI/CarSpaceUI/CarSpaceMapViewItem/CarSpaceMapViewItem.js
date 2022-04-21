import classes from "./CarSpaceMapViewItem.module.css";

import { Typography, Divider } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const CarSpaceMapViewItem = ({
  streetAddress,
  notes,
  size,
  price,
  id,
  image,
  longitude,
  latitude,
  onClick,
}) => {
  const mapItemClickHandler = () => {
    onClick(longitude, latitude, id);
  };

  return (
    <div className={classes.listing} onClick={mapItemClickHandler}>
      <img
        className={classes.imageEntry}
        alt={"parking spot at"}
        src={`data:image/png;base64, ${image}`}
      />
      <div className={classes.lhs}>
        <Typography variant="sectionTitle" className={classes.listingTitle}>
          {streetAddress}
          <Divider
            orientation="horizontal"
            className={classes.navbar_divider_listingTitle}
          />
        </Typography>
        <Typography variant="listItemSubTitle" className={classes.description}>
          {notes.length > 200 ? notes.slice(0, 200) + "..." : notes}
        </Typography>
        <div className={classes.infoBar}>
          <div className={classes.capacity}>
            <DirectionsCarIcon
              className={classes.icon}
              fontSize="small"
              color="primary"
            />
            Fits {size}
          </div>
          <div className={classes.rate}>${price} AUD hour</div>
        </div>
      </div>
    </div>
  );
};

export default CarSpaceMapViewItem;
