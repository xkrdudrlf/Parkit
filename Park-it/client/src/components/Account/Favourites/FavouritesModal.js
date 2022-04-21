import classes from "./FavouritesModal.module.css";

import { useEffect, useState } from "react";

import * as config from "../../../config";
import * as utility from "../../../utility";

import { CircularProgress, Paper, Typography } from "@mui/material";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import CarSpaceCardHeader from "../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardHeader";
import ModalEntry from "../../UI/ModalEntry/ModalEntry";
import CarSpaceImageCarousel from "../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoImageCarousel/CarSpaceImageCarousel";
import CarSpaceImage from "../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoImage/CarSpaceImage";
import CarSpaceInfoFavourite from "../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoFavourite/CarSpaceInfoFavourite";

const FavouritesModal = ({ context, subModalContext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({ images: [] });

  useEffect(() => {
    const fetchData = async () => {
      const { cost, carSpaceId, notes} = context.content;
      try {
        setIsLoading(true);
        // Get CarSpaceInfo
        const carSpaceInfo = await utility.fetchCarSpaceInfo(carSpaceId);

        // Aggregate data and fetch
        const fetchedData = {
          ...carSpaceInfo,
          totalCost: cost,
          notes: notes,
        };
        setData(fetchedData);
        setIsLoading(false);
      } catch (e) {
        setError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [context]);

  return (
    <Paper variant="bookingInfoBody">
      <CarSpaceCardHeader title={data.address} onClose={context.closeModal} />
      {isLoading && (
        <div className={classes["center-container"]}>
          <CircularProgress style={{ color: "var(--green)" }} />
        </div>
      )}
      {!isLoading && error && (
        <div className={classes["center-container"]}>
          {config.NETWORK_ERROR_MESSAGE}
        </div>
      )}
      {!isLoading && !error && (
        <>
          <Paper variant="bookingInfoContent">
            <Paper variant="bookingInfoContentLeft">
              <div className={classes.header}>
                <CarSpaceInfoFavourite
                  modalContext={context}
                  subModalContext={subModalContext}
                  setIsLoading={setIsLoading}
                  setError={setError}
                  carSpaceId={context.content.carSpaceId}
                />
              </div>
              <ModalEntry className={classes.entry} icon={AttachMoneyIcon}>
                <Typography variant="carSpaceModalSubTitle">Price</Typography>
                <Typography variant="carSpaceModalContent">
                  {`$${data.price} per hour / $${data.price * 24} per day`}
                </Typography>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={DirectionsCarIcon}>
                <Typography variant="carSpaceModalSubTitle">
                  Max Vehicle Size
                </Typography>
                <Typography variant="carSpaceModalContent">
                  {data.maxVehicleSize}
                </Typography>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={StickyNote2Icon}>
                <Typography variant="carSpaceModalSubTitle">Notes</Typography>
                <Typography
                  className={classes.notes}
                  variant="carSpaceModalSubContent"
                >
                  {data.notes}
                </Typography>
              </ModalEntry>
            </Paper>
            <Paper variant="bookingInfoContentRight">
              <CarSpaceImageCarousel className={classes["image-carousel"]}>
                {data.images.map((imgObj, idx) => {
                  return (
                    <CarSpaceImage
                      key={idx}
                      src={`data:image/png;base64, ${imgObj.image_data}`}
                      alt="parking-space"
                    />
                  );
                })}
              </CarSpaceImageCarousel>
            </Paper>
          </Paper>
        </>
      )}
    </Paper>
  );
};

export default FavouritesModal;
