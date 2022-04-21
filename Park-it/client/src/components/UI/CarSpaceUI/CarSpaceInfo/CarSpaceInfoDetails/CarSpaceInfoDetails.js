import classes from "./CarSpaceInfoDetails.module.css";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { Typography } from "@mui/material";

const CarSpaceInfoDetails = ({
  startTime,
  endTime,
  streetAddress,
  city,
  state,
  postcode,
  price,
  size,
  notes,
}) => {
  return (
    <div className={classes.details}>
      <div className={classes.details__item}>
        <AccessTimeIcon className={classes.icon} fontSize="large" />
        <div className={classes.details__item__content}>
          <Typography variant="carSpaceModalSubTitle">
            Available Dates
          </Typography>
          <Typography variant="carSpaceModalContent">
            {`${startTime} ~ ${endTime}`}
          </Typography>
        </div>
      </div>
      <div className={classes.details__item}>
        <BusinessIcon className={classes.icon} fontSize="large" />
        <div className={classes.details__item__content}>
          <Typography variant="carSpaceModalSubTitle">ADDRESS</Typography>
          <Typography variant="carSpaceModalContent">
            {`${streetAddress}, ${city}, ${state}, ${postcode}`}
          </Typography>
        </div>
      </div>
      <div className={classes.details__item}>
        <AttachMoneyIcon
          className={classes.icon}
          fontSize="large"
          color="yellow"
        />
        <div className={classes.details__item__content}>
          <Typography variant="carSpaceModalSubTitle">Cost</Typography>
          <Typography variant="carSpaceModalContent">
            ${price} per hour / ${price * 7} per day
          </Typography>
        </div>
      </div>
      <div className={classes.details__item}>
        <DirectionsCarIcon className={classes.icon} fontSize="large" />
        <div className={classes.details__item__content}>
          <Typography variant="carSpaceModalSubTitle">
            Maximum Vehicle Size
          </Typography>
          <Typography variant="carSpaceModalContent">{size}</Typography>
        </div>
      </div>
      <div className={classes.notes}>
        <StickyNote2Icon className={classes.icon} fontSize="large" />
        <div className={classes.details__item__content}>
          <Typography variant="carSpaceModalSubTitle">Notes</Typography>
          <Typography
            variant="carSpaceModalContent"
            className={classes["notes-content"]}
          >
            {notes}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CarSpaceInfoDetails;
