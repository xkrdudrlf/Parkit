import * as utility from "../utility";

export const resetPasswordFormReducer = (state, action) => {
  const newState = { ...state };

  if (action.type === "RESET") {
    return getResetPasswordformInitialState();
  }

  if (action.type === "PASSWORD_INPUT") {
    newState.password.passwordValue = action.value;

    newState.password.isValidLength =
      8 <= action.value.length && action.value.length <= 32;
    newState.password.containsLower = utility.containsLower(action.value);
    newState.password.containsUpper = utility.containsUpper(action.value);
    newState.password.containsDigit = utility.containsDigit(action.value);

    newState.password.isPasswordValid =
      newState.password.isValidLength &&
      newState.password.containsLower &&
      newState.password.containsUpper &&
      newState.password.containsDigit;
  }

  if (action.type === "CONFIRM_PASSWORD_INPUT") {
    newState.password.confirmPasswordValue = action.value;
  }

  newState.password.isConfirmPasswordValid =
    newState.password.confirmPasswordValue === newState.password.passwordValue;

  newState.isFormValid =
    newState.password.isPasswordValid &&
    newState.password.isConfirmPasswordValid;

  return newState;
};

export const getResetPasswordformInitialState = () => {
  return {
    isFormValid: false,
    password: {
      passwordValue: "",
      confirmPasswordValue: "",
      isPasswordValid: true,
      containsDigit: true,
      containsLower: true,
      containsUpper: true,
      isValidLength: true,
      isConfirmPasswordValid: true,
      isMatching: true,
    },
  };
};
