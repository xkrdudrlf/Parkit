import classes from "./CarSpaceInfo.module.css";

import * as config from "../../../../config";

import { CircularProgress, Button } from "@mui/material";

import CarSpaceCardHeader from "../CarSpaceCard/CarSpaceCardHeader";
import CarSpaceCardContent from "../CarSpaceCard/CarSpaceCardContent";
import CarSpaceCardContentLeft from "../CarSpaceCard/CarSpaceCardContentLeft";
import CarSpaceCardContentRight from "../CarSpaceCard/CarSpaceCardContentRight";
import CarSpaceInfoReviews from "./CarSpaceInfoReviews/CarSpaceInfoReviews";

import CarSpaceInfoImageCarousel from "./CarSpaceInfoImageCarousel/CarSpaceImageCarousel";
import CarSpaceInfoImage from "./CarSpaceInfoImage/CarSpaceImage";

import CarSpaceInfoActions from "./CarSpaceInfoActions/CarSpaceInfoActions";
import CarSpaceInfoDetails from "./CarSpaceInfoDetails/CarSpaceInfoDetails";
import CarSpaceInfoFavourite from "./CarSpaceInfoFavourite/CarSpaceInfoFavourite";

const CarSpaceInfo = ({
  title,
  actions,
  isLoading,
  setIsLoading,
  error,
  setError,
  onClose,
  modalContext,
  subModalContext,
  favourite = false,
}) => {
  return (
    <>
      {isLoading && (
        <div className={classes["spinner-container"]}>
          <CircularProgress className={classes.spinner} />
        </div>
      )}
      {!isLoading && !error && (
        <>
          <CarSpaceCardHeader title={title} onClose={onClose}>
            <div className={classes.header}>
              <CarSpaceInfoReviews modalContext={modalContext} />
              {favourite && (
                <CarSpaceInfoFavourite
                  modalContext={modalContext}
                  subModalContext={subModalContext}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              )}
            </div>
          </CarSpaceCardHeader>
          <CarSpaceCardContent>
            <CarSpaceCardContentLeft>
              <CarSpaceInfoImageCarousel>
                {modalContext.carSpaceInfo.images.map((imgObj, idx) => {
                  return (
                    <CarSpaceInfoImage
                      key={idx}
                      src={`data:image/png;base64, ${imgObj.image_data}`}
                      alt="parking-space"
                    />
                  );
                })}
              </CarSpaceInfoImageCarousel>
              <CarSpaceInfoActions actions={actions} />
            </CarSpaceCardContentLeft>
            <CarSpaceCardContentRight>
              <CarSpaceInfoDetails
                startTime={modalContext.carSpaceInfo.startTime}
                endTime={modalContext.carSpaceInfo.endTime}
                streetAddress={modalContext.carSpaceInfo.streetAddress}
                city={modalContext.carSpaceInfo.city}
                state={modalContext.carSpaceInfo.state}
                postcode={modalContext.carSpaceInfo.postcode}
                price={modalContext.carSpaceInfo.price}
                size={modalContext.carSpaceInfo.size}
                notes={modalContext.carSpaceInfo.notes}
              />
            </CarSpaceCardContentRight>
          </CarSpaceCardContent>
        </>
      )}
      {!isLoading && error && (
        <div className={classes.error}>
          {config.NETWORK_ERROR_MESSAGE}
          <Button
            variant="contained"
            size="large"
            onClick={onClose}
            className={classes["error-btn"]}
          >
            OK
          </Button>
        </div>
      )}
    </>
  );
};

export default CarSpaceInfo;
