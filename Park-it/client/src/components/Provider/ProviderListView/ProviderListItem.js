import classes from "./ProviderListItem.module.css";

import { useContext } from "react";
import ProviderModalContext from "../../../contexts/provider-modal-context";

import { Typography } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const ProviderListItem = ({ streetAddress, notes, size, price, id, image }) => {
  const providerModalContext = useContext(ProviderModalContext);

  const listItemClickHandler = () => {
    providerModalContext.openPage("/info", id);
  };

  return (
    <div className={classes.listItem} onClick={listItemClickHandler}>
      <div className={classes.listItem__content}>
        <div className={classes.listItem__content__main}>
          <Typography
            className={classes.listItem__content__title}
            variant="listItemTitle"
            color="primary"
          >
            {streetAddress}
          </Typography>
          <Typography
            variant="listItemSubTitle"
            className={classes.listItem__content__description}
          >
            {notes.length > 200 ? notes.slice(0, 200) + "..." : notes}
          </Typography>
        </div>
        <div className={classes.listItem__content__details}>
          <div className={classes.capacity_rate}>
            <Typography variant="listItemSubTitle" className={classes.capacity}>
              <DirectionsCarIcon
                className={classes.icon}
                fontSize="small"
                color="primary"
              />
              Fits {size}
            </Typography>
            <Typography
              color="primary"
              variant="sectionContent"
              className={classes.rate}
            >
              ${price} AUD hour
            </Typography>
          </div>
        </div>
      </div>
      <img
        className={classes.listItem__image}
        alt="parking at Sydney1"
        src={`data:image/png;base64, ${image}`}
      />
    </div>
  );
};

export default ProviderListItem;
