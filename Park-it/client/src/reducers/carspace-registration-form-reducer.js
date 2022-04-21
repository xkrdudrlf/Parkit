export const carSpaceRegistrationFormReducer = (state, action) => {
  const newState = { ...state };

  if (action.type === "RESET") {
    return getCarSpaceRegistrationFormInitialState();
  }

  if (action.type === "IMAGES_INPUT") {
    newState.images.value = action.value;
    newState.images.isValid = action.value.length > 0;
  }

  if (action.type.includes("TIME_INPUT")) {
    if (action.type === "START_TIME_INPUT")
      newState.startDateTime.value = action.value;

    if (action.type === "END_TIME_INPUT")
      newState.endDateTime.value = action.value;

    const isStartTimeValidUnit =
      newState.startDateTime.value.getMinutes() % 15 === 0;
    const isEndTimeValidUnit =
      newState.endDateTime.value.getMinutes() % 15 === 0;
    const isTimeOrderValid =
      newState.endDateTime.value.getTime() -
        newState.startDateTime.value.getTime() >
      0;

    newState.startDateTime.isValid = isStartTimeValidUnit && isTimeOrderValid;
    newState.endDateTime.isValid = isEndTimeValidUnit && isTimeOrderValid;

    newState.startDateTime.value.setSeconds(0, 0);
    newState.endDateTime.value.setSeconds(0, 0);
  }

  if (action.type === "STREET_NUMBER_INPUT") {
    newState.streetNumber.value = action.value;
    newState.streetNumber.isValid = action.value !== "" && action.value > 0;
  }

  if (action.type === "STREET_NAME_INPUT") {
    newState.streetName.value = action.value;
    newState.streetName.isValid = action.value !== "";
  }

  if (action.type === "CITY_INPUT") {
    newState.city.value = action.value;
    newState.city.isValid = action.value !== "";
  }

  if (action.type === "STATE_INPUT") {
    newState.state.value = action.value;
    newState.state.isValid = action.value !== "";
  }

  if (action.type === "POSTCODE_INPUT") {
    newState.postcode.value = action.value;
    newState.postcode.isValid = action.value !== "";
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
    newState.startDateTime.isValid &&
    newState.endDateTime.isValid &&
    newState.streetNumber.isValid &&
    newState.streetName.isValid &&
    newState.city.isValid &&
    newState.state.isValid &&
    newState.postcode.isValid &&
    newState.price.isValid &&
    newState.maxVehicleSize.isValid &&
    newState.notes.isValid;

  return newState;
};

export const getCarSpaceRegistrationFormInitialState = () => {
  return {
    isFormValid: false,
    images: { value: [], isValid: false },
    startDateTime: { value: new Date(), isValid: false },
    endDateTime: { value: new Date(), isValid: false },
    streetNumber: { value: "", isValid: false },
    streetName: { value: "", isValid: false },
    city: { value: "", isValid: false },
    state: { value: "", isValid: false },
    postcode: { value: "", isValid: false },
    price: { value: "", isValid: false },
    maxVehicleSize: { value: "", isValid: false },
    notes: { value: "", isValid: false },
  };
};
