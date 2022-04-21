import classes from "./CarSpaceEditForm.module.css";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import { useContext, useEffect, useReducer, useState } from "react";

import AuthContext from "../../../../contexts/auth-context";
import CarSpaceModalContext from "../../../../contexts/provider-modal-context";
import {
  carSpaceEditFormReducer,
  getCarSpaceEditFormInitialState,
} from "../../../../reducers/carspace-edit-form-reducer";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import DateTimePicker from "@mui/lab/DateTimePicker";
import {
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";

import InputField from "../../../UI/InputField/InputField";
import DropdownSelect from "../../../UI/DropdownSelect/DropdownSelect";
import CarSpaceFormSubModal from "../../../UI/CarSpaceUI/CarSpaceForm/CarSpaceFormSubModal/CarSpaceFormSubModal";
import CarSpaceCardHeader from "../../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardHeader";
import CarSpaceCardContent from "../../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardContent";
import CarSpaceCardContentLeft from "../../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardContentLeft";
import CarSpaceFormImageCarousel from "../../../UI/CarSpaceUI/CarSpaceForm/CarSpaceFormImageCarousel/CarSpaceFormImageCarousel";
import CarSpaceCardContentRight from "../../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardContentRight";

const CarSpaceEditForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subModal, setSubModal] = useState({
    isOpen: false,
    onClickOk: null,
    onClose: () => {},
    title: "",
    content: [],
  });
  const [formState, dispatchFormState] = useReducer(
    carSpaceEditFormReducer,
    getCarSpaceEditFormInitialState()
  );
  const authContext = useContext(AuthContext);
  const carSpaceModalContext = useContext(CarSpaceModalContext);

  useEffect(() => {
    dispatchFormState({
      type: "FETCH",
      value: carSpaceModalContext.carSpaceInfo,
    });
  }, [carSpaceModalContext.carSpaceInfo]);

  // Image Upload Handlers
  const imageUploadHandler = async (e) => {
    const images = Array.from(e.target.files);
    const base64Images = await utility.convertImagesToBase64(images);

    dispatchFormState({ type: "IMAGES_INPUT", value: base64Images });
  };

  const imageDeleteHandler = (e) => {
    const targetImageNum = e.target.dataset.imagenum;
    formState.images.value.splice(targetImageNum, 1);

    dispatchFormState({ type: "IMAGES_INPUT", value: formState.images.value });
  };

  // Price/Vehicle Size/Notes Handler
  const priceChangeHandler = (e) => {
    dispatchFormState({ type: "PRICE_INPUT", value: e.target.value });
  };

  const maxVehicleSizeChangeHandler = (e) => {
    dispatchFormState({
      type: "MAX_VEHICLE_SIZE_INPUT",
      value: e.target.value,
    });
  };

  const notesChangeHandler = (e) => {
    dispatchFormState({ type: "NOTES_INPUT", value: e.target.value });
  };

  // EndDateTime Handler
  const endDateTimeChangeHandler = (newDate) => {
    dispatchFormState({
      type: "END_TIME_INPUT",
      value: newDate,
    });
  };

  // Form Submission
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      const formData = {
        provider: authContext.userInfo.pk,
        startTime: formState.startDateTime,
        endTime: formState.endDateTime.value,
        streetAddress: formState.streetAddress,
        city: formState.city,
        state: formState.state,
        postcode: formState.postcode,
        price: formState.price.value,
        size: formState.maxVehicleSize.value,
        images: formState.images.value,
        notes: formState.notes.value,
      };

      const carSpaceEditUrl = `${config.SERVER_URL}/api/provider/parking/${carSpaceModalContext.carSpaceId}`;
      const carSpaceEditOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: formData,
      };
      const carSpaceEditResponse = await utility.sendRequest(
        carSpaceEditUrl,
        carSpaceEditOptions,
        setIsEditing
      );

      if (!carSpaceEditResponse.status)
        throw Error(config.NETWORK_ERROR_MESSAGE);
      if (carSpaceEditResponse.status >= 300) {
        const errorMsgs = [];
        for (const key of Object.keys(carSpaceEditResponse.data)) {
          errorMsgs.push(` - Not a valid ${key}.`);
        }
        throw Error(errorMsgs);
      }

      carSpaceModalContext.toggleCarSpacesRefreshStatus();

      setSubModal({
        isOpen: true,
        onClose: closeAllHandler,
        title: "Success",
        content: ["Your space has been successfully edited"],
      });
    } catch (e) {
      setSubModal({
        isOpen: true,
        onClose: closeSubModalHandler,
        title: "Error",
        content: e.message.split(","),
      });
    }
  };

  // Navigation handlers
  const closeSubModalHandler = () => {
    setSubModal((prev) => {
      return { ...prev, isOpen: false };
    });
  };
  const closeAllHandler = () => {
    setSubModal((prev) => {
      return { ...prev, isOpen: false };
    });
    carSpaceModalContext.closeModal();
  };

  const backToCarSpaceInfoHandler = () => {
    carSpaceModalContext.openPage("/info");
  };

  // Delete Car Space Handlers
  const clickDeleteButtonHandler = () => {
    setSubModal({
      isOpen: true,
      onClickOk: deleteCarSpaceHandler,
      onClose: closeSubModalHandler,
      title: "Confirmation",
      content: [
        `Once you delete the car space, the space won't be available on the user search anymore.  
        And you still need to provide services to the remaning bookings for this space. 
        If you still agree with this, please click 'OK' button to proceed.`,
      ],
    });
  };

  const deleteCarSpaceHandler = async () => {
    try {
      closeSubModalHandler();

      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      const carSpaceDeleteUrl = `${config.SERVER_URL}/api/provider/parking/${carSpaceModalContext.carSpaceId}`;
      const carSpaceDeleteOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: {
          provider: authContext.userInfo.pk,
          startTime: formState.startDateTime,
          endTime: formState.endDateTime.value,
          streetAddress: formState.streetAddress,
          city: formState.city,
          state: formState.state,
          postcode: formState.postcode,
          price: formState.price.value,
          size: formState.maxVehicleSize.value,
          images: formState.images.value,
          notes: formState.notes.value,
          status: "cancelled",
        },
      };
      const carSpaceDeleteResponse = await utility.sendRequest(
        carSpaceDeleteUrl,
        carSpaceDeleteOptions,
        setIsDeleting
      );

      if (
        !carSpaceDeleteResponse.status ||
        carSpaceDeleteResponse.status >= 300
      )
        throw Error(config.NETWORK_ERROR_MESSAGE);

      carSpaceModalContext.toggleCarSpacesRefreshStatus();

      setSubModal({
        isOpen: true,
        onClose: closeAllHandler,
        title: "Success",
        content: ["Your space has been successfully deleted"],
      });
    } catch (e) {
      setSubModal({
        isOpen: true,
        onClose: closeSubModalHandler,
        title: "Error",
        content: e.message.split(","),
      });
    }
  };

  return (
    <form onSubmit={formSubmitHandler} className={classes.form}>
      <CarSpaceFormSubModal
        open={subModal.isOpen}
        onClickOk={subModal.onClickOk}
        onClose={subModal.onClose}
        title={subModal.title}
        content={subModal.content}
      />
      <CarSpaceCardHeader
        title={"Edit Car Space"}
        onClose={carSpaceModalContext.closeModal}
        onBack={backToCarSpaceInfoHandler}
      />
      <CarSpaceCardContent>
        <CarSpaceCardContentLeft>
          <div className={classes["image-upload-container"]}>
            <CarSpaceFormImageCarousel
              images={formState.images.value.map((imgObj) => imgObj.image_data)}
              onDeleteImage={imageDeleteHandler}
            />
            <div className={classes["image-uploader"]}>
              <InputField
                type="file"
                onChange={imageUploadHandler}
                multiple={true}
              />
            </div>
          </div>
          <div className={classes.actions}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={!formState.isFormValid}
            >
              {isEditing ? <CircularProgress size="1.5rem" /> : "Edit"}
            </Button>
            <Button
              variant="contained"
              size="large"
              color="warning"
              onClick={clickDeleteButtonHandler}
            >
              {isDeleting ? <CircularProgress size="1.5rem" /> : "Delete"}
            </Button>
          </div>
        </CarSpaceCardContentLeft>
        <CarSpaceCardContentRight>
          <div className={classes.details}>
            <div className={classes.details__item}>
              <AccessTimeIcon className={classes.icon} fontSize="large" />
              <div>
                <div className={classes.details__item__content__row}>
                  <DateTimePicker
                    label="Available From"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={classes["date-input"]}
                      />
                    )}
                    value={formState.startDateTime}
                    onChange={() => {}}
                    inputFormat="dd/MM/yyyy hh:mm a"
                    readOnly
                  />
                  <DateTimePicker
                    label="Available To"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={classes["date-input"]}
                        error={!formState.endDateTime.isValid}
                      />
                    )}
                    value={formState.endDateTime.value}
                    minDateTime={
                      formState.latestTime
                        ? utility.getDate(formState.latestTime)
                        : false
                    }
                    onChange={endDateTimeChangeHandler}
                    shouldDisableTime={(timeValue, clockType) => {
                      return clockType === "minutes" && timeValue % 15;
                    }}
                    reduceAnimations={true}
                    inputFormat="dd/MM/yyyy hh:mm a"
                  />
                </div>
                <FormHelperText>
                  * The parking space must remain available at least until the
                  end of the latest-ending booking. You may still cancel the
                  listing to prevent new bookings.
                  <br />
                  {formState.latestTime &&
                  utility.getDate(formState.latestTime).getTime() -
                    new Date().getTime() >
                    0
                    ? `* The end datetime of the most recent booking is ${formState.latestTime}`
                    : "* There are no existing bookings."}
                </FormHelperText>
              </div>
            </div>
            <div className={classes.details__item}>
              <BusinessIcon className={classes.icon} fontSize="large" />
              <div className={classes.details__item__content}>
                <Typography variant="carSpaceModalSubTitle">ADDRESS</Typography>
                <Typography variant="carSpaceModalContent">
                  {`${formState.streetAddress}, ${formState.city}, ${formState.state}, ${formState.postcode}`}
                </Typography>
              </div>
            </div>
            <div className={classes.details__item}>
              <AttachMoneyIcon
                className={classes.icon}
                fontSize="large"
                color="yellow"
              />
              <InputField
                className={classes.input}
                inputClassName={classes.input}
                label="Price (Hourly rate)"
                type="number"
                name="price"
                value={formState.price.value}
                onChange={priceChangeHandler}
              />
            </div>
            <div className={classes.details__item}>
              <DirectionsCarIcon className={classes.icon} fontSize="large" />
              <DropdownSelect
                className={`${classes.input}`}
                selectClassName={classes.input}
                selectMenuClassName={classes["select-menu"]}
                selectItemClassName={classes["select-item"]}
                labelId="maxVehicleSizeLabelId"
                selectId="maxVehicleSizeSelectId"
                label="Max Vehicle Size"
                value={formState.maxVehicleSize.value}
                onChange={maxVehicleSizeChangeHandler}
                items={config.VEHICLE_TYPES}
              />
            </div>
            <div className={classes.notes}>
              <StickyNote2Icon className={classes.icon} fontSize="large" />
              <InputField
                className={classes.input}
                label="Notes"
                type="text"
                name="notes"
                multiline={true}
                maxRows={3}
                minRows={3}
                value={formState.notes.value}
                onChange={notesChangeHandler}
                placeholder={`Please type N/A if nothing to type here.`}
              />
            </div>
          </div>
        </CarSpaceCardContentRight>
      </CarSpaceCardContent>
    </form>
  );
};

export default CarSpaceEditForm;
