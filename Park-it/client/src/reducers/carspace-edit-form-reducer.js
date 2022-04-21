import { getDate } from "../utility";

export const carSpaceEditFormReducer = (state, action) => {
  const newState = { ...state };

  if (action.type === "FETCH") {
    return {
      isFormValid: true,
      images: {
        value: action.value.images,
        isValid: true,
      },
      startDateTime: getDate(action.value.startTime),
      endDateTime: { value: getDate(action.value.endTime), isValid: true },
      latestTime: action.value.latestTime,
      streetAddress: action.value.streetAddress,
      city: action.value.city,
      state: action.value.state,
      postcode: action.value.postcode,
      price: { value: action.value.price, isValid: true },
      maxVehicleSize: { value: action.value.size, isValid: true },
      notes: { value: action.value.notes, isValid: true },
    };
  }

  if (action.type === "END_TIME_INPUT") {
    newState.endDateTime.value = action.value;
  }

  if (action.type === "IMAGES_INPUT") {
    newState.images.value = action.value;
    newState.images.isValid = action.value.length > 0;
  }

  if (action.type === "PRICE_INPUT") {
    newState.price.value = action.value;
    newState.price.isValid = action.value !== "" && action.value > 0;
  }

  if (action.type === "MAX_VEHICLE_SIZE_INPUT") {
    newState.maxVehicleSize.value = action.value;
    newState.maxVehicleSize.isValid = action.value !== "";
  }

  if (action.type === "NOTES_INPUT") {
    newState.notes.value = action.value;
    newState.notes.isValid = action.value !== "";
  }

  newState.isFormValid =
    newState.images.isValid &&
    newState.price.isValid &&
    newState.maxVehicleSize.isValid &&
    newState.notes.isValid;

  return newState;
};

export const getCarSpaceEditFormInitialState = () => {
  return {
    isFormValid: false,
    images: { value: [], isValid: false },
    startDateTime: "",
    endDateTime: { value: "", isValid: false },
    latestTime: "22/02/2222 22:22",
    streetAddress: "",
    city: "",
    state: "",
    postcode: "",
    price: { value: "", isValid: false },
    maxVehicleSize: { value: "", isValid: false },
    notes: { value: "", isValid: false },
  };
};
