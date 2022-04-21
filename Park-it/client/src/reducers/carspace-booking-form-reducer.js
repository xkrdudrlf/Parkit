import * as utility from "../utility";

export const carSpaceBookingFormReducer = (state, action) => {
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

    if (newState.startDateTime.isValid && newState.endDateTime.isValid) {
      const timeDiffInHours = timeDiffInMilliseconds / (1000 * 60 * 60);
      newState.duration = timeDiffInHours;
    }
  }

  if (action.type === "VEHICLE_INPUT") {
    newState.vehicle.value = action.value;
    newState.vehicle.isValid = action.value.name !== "";
  }

  newState.isFormValid =
    newState.startDateTime.isValid &&
    newState.endDateTime.isValid &&
    newState.vehicle.isValid;

  return newState;
};

export const getCarSpaceBookingFormInitialState = (
  earliest = new Date(),
  latest = new Date()
) => {
  return {
    isFormValid: false,
    earliest,
    latest,
    startDateTime: { value: earliest, isValid: true },
    endDateTime: { value: latest, isValid: true },
    vehicle: { value: { name: "", id: "" }, isValid: false },
    duration: utility.getTimeDiffInHours(latest, earliest),
  };
};
