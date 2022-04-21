export const carFormReducer = (state, action) => {
  const newState = { ...state };

  if (action.type === "MANUFACTURER_INPUT") {
    newState.manufacturer.value = action.value;
    newState.manufacturer.isValid = action.value !== "";
  }

  if (action.type === "MODEL_INPUT") {
    newState.model.value = action.value;
    newState.model.isValid = action.value !== "";
  }

  if (action.type === "YEAR_INPUT") {
    newState.year.value = action.value;
    newState.year.isValid = action.value !== "";
  }

  if (action.type === "COLOUR_INPUT") {
    newState.colour.value = action.value;
    newState.colour.isValid = action.value !== "";
  }

  if (action.type === "REGISTRATION_NUMBER_INPUT") {
    newState.registrationNumber.value = action.value;
    newState.registrationNumber.isValid =
      5 <= action.value.length && action.value.length <= 7;
  }

  newState.isFormValid =
    newState.manufacturer.isValid &&
    newState.model.isValid &&
    newState.year.isValid &&
    newState.colour.isValid &&
    newState.registrationNumber.isValid;

  return newState;
};

export const carFormInitialState = () => {
  return {
    isFormValid: false,
    manufacturer: { value: "", isValid: false },
    model: { value: "", isValid: false },
    year: { value: "", isValid: false },
    colour: { value: "", isValid: false },
    registrationNumber: { value: "", isValid: false },
  };
};
