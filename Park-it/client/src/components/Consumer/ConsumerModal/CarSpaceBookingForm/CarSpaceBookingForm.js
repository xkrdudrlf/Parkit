import classes from "./CarSpaceBookingForm.module.css";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import { useContext, useEffect, useReducer, useState } from "react";

import {
  carSpaceBookingFormReducer,
  getCarSpaceBookingFormInitialState,
} from "../../../../reducers/carspace-booking-form-reducer";
import SubModalContext from "../../../../contexts/submodal-context";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessIcon from "@mui/icons-material/Business";
import PaymentIcon from "@mui/icons-material/Payment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SellIcon from "@mui/icons-material/Sell";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";

import ConsumerModalContext from "../../../../contexts/consumer-modal-context";
import CarSpaceCardHeader from "../../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardHeader";
import GeneralModalContent from "../../../UI/GeneralModal/GeneralModalContent";
import ModalEntry from "../../../UI/ModalEntry/ModalEntry";
import DropdownSelect from "../../../UI/DropdownSelect/DropdownSelect";
import GeneralModalActions from "../../../UI/GeneralModal/GeneralModalActions";
import CarSpaceImageCarousel from "../../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoImageCarousel/CarSpaceImageCarousel";
import CarSpaceImage from "../../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfoImage/CarSpaceImage";
import AuthContext from "../../../../contexts/auth-context";

const CarSpaceBookingForm = () => {
  const consumerModalContext = useContext(ConsumerModalContext);
  const authContext = useContext(AuthContext);
  const subModalContext = useContext(SubModalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [myCars, setMyCars] = useState({});
  const [formState, dispatchFormState] = useReducer(
    carSpaceBookingFormReducer,
    getCarSpaceBookingFormInitialState(
      consumerModalContext.searchDate.startDate,
      consumerModalContext.searchDate.endDate
    )
  );

  const { streetAddress, city, state, postcode } =
    consumerModalContext.carSpaceInfo;
  const { price, size, images } = consumerModalContext.carSpaceInfo;
  const cardNumber = authContext.userInfo.card_number;
  const paymentMethodValidity = cardNumber !== "" && cardNumber !== undefined;

  const vehicleChangeHandler = (e) => {
    const carName = e.target.value;
    const carId = myCars[carName];

    dispatchFormState({
      type: "VEHICLE_INPUT",
      value: { name: carName, id: carId },
    });
  };

  const displayConfirmModal = (e) => {
    e.preventDefault();

    subModalContext.openModal({
      title: "Confirmation",
      messages: [
        "You cannot cancel your booking within 7 days of start date. Do you still want to proceed?",
      ],
      actions: [
        {
          color: "primary",
          onClick: submitFormHandler,
          content: "OK",
          width: "120px",
        },
        {
          color: "warning",
          onClick: subModalContext.closeModal,
          content: "Cancel",
          width: "120px",
        },
      ],
    });
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      const url = `${config.SERVER_URL}/api/consumer/book`;
      const formData = {
        provider: consumerModalContext.carSpaceInfo.provider,
        consumer: authContext.userInfo.pk,
        vehicle: formState.vehicle.value.id,
        parkingSpace: consumerModalContext.carSpaceId,
        startTime: formState.startDateTime.value,
        endTime: formState.endDateTime.value,
        totalCost: formState.duration * price,
      };

      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: formData,
      };

      const response = await utility.sendRequest(url, options, setIsLoading);
      if (!response.status || response.status >= 300) throw Error;

      subModalContext.openModal({
        title: "Success",
        messages: [
          "Your Booking has been successfully registered in the system.",
        ],
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeAllModals(
              consumerModalContext,
              "/consumer"
            ),
            content: "OK",
            width: "120px",
          },
        ],
        context: consumerModalContext,
      });
    } catch (e) {
      subModalContext.openModal({
        title: "Error",
        messages: [config.NETWORK_ERROR_MESSAGE],
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
    const getMyCars = async () => {
      try {
        const authToken = localStorage.getItem("parkItAuthToken");
        const url = `${config.SERVER_URL}/api/consumer/vehicle/all`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };
        const response = await utility.sendRequest(url, options, setIsLoading);

        if (!response.status || response.status >= 300)
          throw Error(config.NETWORK_ERROR_MESSAGE);

        const cars = {};
        for (const carObj of response.data) {
          cars[`${carObj.carMake} ${carObj.carModel}(${carObj.carYear})`] =
            carObj.pk;
        }

        setMyCars(cars);
      } catch (e) {
        setError(true);
      }
    };

    getMyCars();
  }, []);

  return (
    <form className={classes.form} onSubmit={displayConfirmModal}>
      <CarSpaceCardHeader
        title={"Book Car Space"}
        onClose={consumerModalContext.closeModal}
        onBack={consumerModalContext.backToInfo}
      />
      <GeneralModalContent direction="row">
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
            <div className={classes.leftSection}>
              <ModalEntry className={classes.entry} icon={BusinessIcon}>
                <Typography variant="carSpaceModalSubTitle">Address</Typography>
                <Typography variant="carSpaceModalSubContent">
                  {`${streetAddress}, ${city}, ${state}, ${postcode}`}
                </Typography>
              </ModalEntry>
              <ModalEntry
                className={classes.entry}
                icon={AccessTimeIcon}
                direction="row"
              >
                <DateTimePicker
                  label="From"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={classes["date-input"]}
                      error={!formState.startDateTime.isValid}
                    />
                  )}
                  value={formState.startDateTime.value}
                  minDateTime={formState.earliest}
                  maxDateTime={formState.latest}
                  onChange={(newDate) => {
                    dispatchFormState({
                      type: "START_TIME_INPUT",
                      value: newDate,
                    });
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    return clockType === "minutes" && timeValue % 15;
                  }}
                  inputFormat="dd/MM/yyyy hh:mm a"
                />

                <DateTimePicker
                  label="Until"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={classes["date-input"]}
                      error={!formState.endDateTime.isValid}
                    />
                  )}
                  value={formState.endDateTime.value}
                  minDateTime={formState.earliest}
                  maxDateTime={formState.latest}
                  onChange={(newDate) => {
                    dispatchFormState({
                      type: "END_TIME_INPUT",
                      value: newDate,
                    });
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    return clockType === "minutes" && timeValue % 15;
                  }}
                  inputFormat="dd/MM/yyyy hh:mm a"
                />
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={AttachMoneyIcon}>
                <Typography variant="carSpaceModalSubTitle">Price</Typography>
                <Typography variant="carSpaceModalSubContent">
                  {`$${price} per hour / $${price * 24} per day`}
                </Typography>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={DirectionsCarIcon}>
                <Typography variant="carSpaceModalSubTitle">
                  Maximum Vehicle Size
                </Typography>
                <Typography variant="carSpaceModalSubContent">
                  {size}
                </Typography>
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={DirectionsCarIcon}>
                <DropdownSelect
                  className={classes.dropdown}
                  selectClassName={classes.select}
                  selectMenuClassName={classes["select-menu"]}
                  labelId="vehicleLabelId"
                  selectId="vehicleSelectId"
                  label="Select Vehicle"
                  value={formState.vehicle.value.name}
                  onChange={vehicleChangeHandler}
                  items={Object.keys(myCars)}
                />
              </ModalEntry>
              <GeneralModalActions>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={!formState.isFormValid || !paymentMethodValidity}
                  className={classes.btn}
                >
                  {isLoading ? <CircularProgress size="1.5rem" /> : "Book Now"}
                </Button>
              </GeneralModalActions>
            </div>
            <div className={classes.rightSection}>
              <CarSpaceImageCarousel className={classes["image-carousel"]}>
                {images.map((imgObj, idx) => {
                  return (
                    <CarSpaceImage
                      key={idx}
                      src={`data:image/png;base64, ${imgObj.image_data}`}
                      alt="parking-space"
                    />
                  );
                })}
              </CarSpaceImageCarousel>
              <ModalEntry className={classes.entry} icon={PaymentIcon}>
                <Typography variant="carSpaceModalSubTitle">Payment</Typography>
                {paymentMethodValidity ? (
                  <>
                    <Typography variant="carSpaceModalSubContent">
                      {`Card Number : **** **** **** ${cardNumber.slice(
                        12,
                        16
                      )}`}
                    </Typography>
                    <Typography variant="carSpaceModalSubContent">
                      {`Expiry Date : ${authContext.userInfo.expiry_date}`}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="carSpaceModalSubContent" color="red">
                    No card found. Please register a card in Account Details
                    Page.
                  </Typography>
                )}
              </ModalEntry>
              <ModalEntry className={classes.entry} icon={SellIcon}>
                <Typography variant="carSpaceModalSubTitle">
                  Total Cost
                </Typography>
                <Typography variant="carSpaceModalSubContent">{`$${
                  formState.duration * price
                }`}</Typography>
              </ModalEntry>
            </div>
          </>
        )}
      </GeneralModalContent>
    </form>
  );
};

export default CarSpaceBookingForm;
