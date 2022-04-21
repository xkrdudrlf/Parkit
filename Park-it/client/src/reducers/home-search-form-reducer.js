export const homeSearchFormReducer = (state, action) => {
  const newState = { ...state };

  if (action.type.includes("TIME_INPUT")) {
    if (action.type === "START_TIME_INPUT")
      newState.startDateTime.value = action.value;

    if (action.type === "END_TIME_INPUT")
      newState.endDateTime.value = action.value;

    const isStartTimeValidUnit =
      newState.startDateTime.value.getMinutes() % 15 === 0;
    const isEndTimeValidUnit =
      newState.endDateTime.value.getMinutes() % 15 === 0;
    const timeDiffInMilliseconds =
      newState.endDateTime.value.getTime() -
      newState.startDateTime.value.getTime();
    const isTimeOrderValid = timeDiffInMilliseconds > 0;

    newState.startDateTime.isValid = isStartTimeValidUnit && isTimeOrderValid;
    newState.endDateTime.isValid = isEndTimeValidUnit && isTimeOrderValid;

    newState.startDateTime.value.setSeconds(0, 0);
    newState.endDateTime.value.setSeconds(0, 0);
  }

  if (action.type === "ADDRESS_INPUT") {
    newState.address.value = action.value;
    newState.address.isValid = action.value.name !== "";
  }

  if (action.type === "RADIUS_INPUT") {
    newState.radius = action.value;
  }

  newState.isFormValid =
    newState.address.isValid &&
    newState.startDateTime.isValid &&
    newState.endDateTime.isValid;

  return newState;
};

export const homeSearchFormInitialState = (initialState) => {
  if (initialState) {
    return {
      isFormValid: true,
      address: { value: initialState.address, isValid: true },
      startDateTime: { value: initialState.startDateTime, isValid: true },
      endDateTime: { value: initialState.endDateTime, isValid: true },
      radius: initialState.radius,
    };
  }

  return {
    isFormValid: false,
    address: { value: "", isValid: false },
    startDateTime: { value: new Date(), isValid: false },
    endDateTime: { value: new Date(), isValid: false },
    radius: "",
  };
};
