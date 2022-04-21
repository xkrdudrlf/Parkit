import classes from "./ConsumerBookingInfo.module.css";

import { useEffect, useState, useContext } from "react";

import * as config from "../../../config";
import * as utility from "../../../utility";

import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SellIcon from "@mui/icons-material/Sell";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import CarSpaceCardHeader from "../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardHeader";
import ModalEntry from "../../UI/ModalEntry/ModalEntry";
import GeneralModalActions from "../../UI/GeneralModal/GeneralModalActions";
import CarSpaceImageCarousel from "../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoImageCarousel/CarSpaceImageCarousel";
import CarSpaceImage from "../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoImage/CarSpaceImage";
import CarSpaceInfoFavourite from "../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoFavourite/CarSpaceInfoFavourite";

import AccountModalContext from "../../../contexts/account-modal-context";

const ConsumerBookingInfo = ({ context, subModalContext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({ images: [] });
  const [enableReview, setEnableReview] = useState(true);
  const [enableDelete, setEnableDelete] = useState(true);

  const accountModalContext = useContext(AccountModalContext);

  const addReviewsPage = () => {
    accountModalContext.setContent(data);
    accountModalContext.openPage("/addReview", "small");
  };

  const deleteBooking = (e) => {
    e.preventDefault();

    subModalContext.openModal({
      title: "Confirmation",
      messages: [
        "You are about to delete this booking. Do you still want to proceed?",
      ],
      actions: [
        {
          color: "primary",
          onClick: submitDeleteBooking,
          content: "OK",
          width: "120px",
        },
        {
          color: "warning",
          onClick: subModalContext.closeAllModals(context),
          content: "Cancel",
          width: "120px",
        },
      ],
    });
  };

  const submitDeleteBooking = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;
      const url = `${config.SERVER_URL}/api/consumer/book/${context.content.id}`;
      const options = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      };

      const response = await utility.sendRequest(url, options, setIsLoading);
      if (!response.status) throw Error(config.NETWORK_ERROR_MESSAGE);
      if (response.status >= 300) {
        const errorMsgs = [];
        for (const key of Object.keys(response.data)) {
          errorMsgs.push(` - Not a valid ${key}.`);
        }
        throw Error(errorMsgs);
      }
      subModalContext.openModal({
        title: "Success",
        messages: ["You have removed this booking."],
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeAllModals(context),
            content: "OK",
            width: "120px",
          },
        ],
        context: context,
      });

      context.togglePageRefreshStatus();
    } catch (e) {
      subModalContext.openModal({
        title: "Error",
        messages: e.message.split(","),
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeModal,
            content: "OK",
            width: "120px",
          },
        ],
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { carSpaceId, consumer, cost, publishDate, vehicleId } =
        context.content;
      try {
        setIsLoading(true);
        // Get CarSpaceInfo
        const carSpaceInfo = await utility.fetchCarSpaceInfo(carSpaceId);
        // Get CarInfo
        const carInfo = await utility.fetchCarInfo(vehicleId);
        const { carMake, carColour, carModel, carYear, carRego } = carInfo;

        // Aggregate data and fetch
        const fetchedData = {
          ...carSpaceInfo,
          vehicle: `${carMake} ${carColour} ${carModel}(${carYear}) [${carRego}]`,
          transactionDate: publishDate,
          totalCost: cost,
          carSpaceId: carSpaceId,
          consumer: consumer,
        };
        setData(fetchedData);

        var currentDate = new Date();
        // Can review after booking ends
        const bookingEndDate = utility.getDate(context.content.endTime);
        setEnableReview(currentDate.getTime() >= bookingEndDate.getTime());

        // Check start date to enable delete bookings button
        const bookingStartDate = utility.getDate(context.content.startTime);
        const difference = utility.getTimeDiffInHours(
          bookingStartDate,
          currentDate
        );
        const result = difference >= 168;

        setEnableDelete(result);
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
      <CarSpaceCardHeader
        title={"Booking Receipt"}
        onClose={context.closeModal}
      />
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
                  carSpaceId={data.carSpaceId}
                />
              </div>
              <ModalEntry className={classes.entry} icon={BusinessIcon}>
                <Typography variant="carSpaceModalSubTitle">Address</Typography>
                <Typography variant="carSpaceModalSubContent">
                  {data.address}
                </Typography>
              </ModalEntry>
              <ModalEntry
                className={classes.entry}
                icon={AccessTimeIcon}
                direction="row"
              >
                <ModalEntry>
                  <Typography variant="carSpaceModalSubTitle">From</Typography>
                  <Typography variant="carSpaceModalSubContent">
                    {context.content.startTime}
                  </Typography>
                </ModalEntry>
                <ModalEntry>
                  <Typography variant="carSpaceModalSubTitle">Until</Typography>
                  <Typography variant="carSpaceModalSubContent">
                    {context.content.endTime}
                  </Typography>
                </ModalEntry>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={AttachMoneyIcon}>
                <Typography variant="carSpaceModalSubTitle">Price</Typography>
                <Typography variant="carSpaceModalSubContent">
                  {`$${data.price} per hour / $${data.price * 24} per day`}
                </Typography>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={DirectionsCarIcon}>
                <Typography variant="carSpaceModalSubTitle">
                  Max Vehicle Size
                </Typography>
                <Typography variant="carSpaceModalSubContent">
                  {data.maxVehicleSize}
                </Typography>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={DirectionsCarIcon}>
                <Typography variant="carSpaceModalSubTitle">Vehicle</Typography>
                <Typography variant="carSpaceModalSubContent">
                  {data.vehicle}
                </Typography>
              </ModalEntry>
            </Paper>
            <Paper variant="bookingInfoContentRight">
              <CarSpaceImageCarousel className={classes["image-carousel"]}>
                {/* {data.images.map((imgObj, idx) => {
                  return (
                    <CarSpaceImage
                      key={idx}
                      src={`data:image/png;base64, ${imgObj.image_data}`}
                      alt="parking-space"
                    />
                  );
                })} */}
                {data.images.length > 0 && (
                  <CarSpaceImage
                    src={`data:image/png;base64, ${data.images[0].image_data}`}
                    alt="parking-space"
                  />
                )}
              </CarSpaceImageCarousel>
              <ModalEntry className={classes.entry} icon={CalendarTodayIcon}>
                <Typography variant="carSpaceModalSubTitle">
                  Transaction Date
                </Typography>
                <Typography variant="carSpaceModalSubContent">
                  {data.transactionDate}
                </Typography>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={SellIcon}>
                <Typography variant="carSpaceModalSubTitle">
                  Total Cost
                </Typography>
                <Typography variant="carSpaceModalSubContent">
                  $ {data.totalCost}
                </Typography>
              </ModalEntry>
            </Paper>
          </Paper>
          <GeneralModalActions>
            <Button
              variant="contained"
              type="submit"
              size="large"
              className={classes.btn}
              onClick={addReviewsPage}
              disabled={!enableReview}
            >
              Write Review
            </Button>
            <Button
              variant="contained"
              type="submit"
              size="large"
              color="warning"
              className={classes.btn}
              onClick={deleteBooking}
              disabled={!enableDelete}
            >
              {isLoading ? (
                <CircularProgress size="1.5rem" />
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </GeneralModalActions>
        </>
      )}
    </Paper>
  );
};

export default ConsumerBookingInfo;
