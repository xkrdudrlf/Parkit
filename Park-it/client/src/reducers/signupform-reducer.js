import * as utility from "../utility";

export const signupformStateReducer = (state, action) => {
  const newState = { ...state };

  if (action.type === "RESET") {
    return getSignupformInitialState();
  }

  if (action.type === "USERNAME_INPUT") {
    newState.username.value = action.value;
    newState.username.isValid =
      1 <= action.value.length && action.value.length <= 20;
  }

  if (action.type === "FIRSTNAME_INPUT" || action.type === "LASTNAME_INPUT") {
    if (action.type === "FIRSTNAME_INPUT") {
      newState.legalname.firstnameValue = action.value;
      newState.legalname.isFirstnameValid = action.value.length > 0;
    }

    if (action.type === "LASTNAME_INPUT") {
      newState.legalname.lastnameValue = action.value;
      newState.legalname.isLastnameValid = action.value.length > 0;
    }

    newState.legalname.isValid =
      newState.legalname.isFirstnameValid && newState.legalname.isLastnameValid;
  }

  if (
    action.type === "PASSWORD_INPUT" ||
    action.type === "CONFIRM_PASSWORD_INPUT"
  ) {
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
      newState.password.confirmPasswordValue ===
      newState.password.passwordValue;

    newState.password.isValid =
      newState.password.isPasswordValid &&
      newState.password.isConfirmPasswordValid;
  }

  if (action.type === "EMAIL_INPUT") {
    newState.email.value = action.value;
    newState.email.isValid = action.value.includes("@");
  }

  if (action.type === "PHONE_INPUT") {
    newState.phone.value = action.value;
    newState.phone.isValid =
      utility.containsOnlyDigis(action.value) && action.value.length === 10;
  }

  newState.isFormValid =
    newState.username.isValid &&
    newState.legalname.isValid &&
    newState.password.isValid &&
    newState.email.isValid &&
    newState.phone.isValid;

  return newState;
};

export const getSignupformInitialState = () => {
  return {
    isFormValid: false,
    username: { value: "", isValid: false },
    legalname: {
      firstnameValue: "",
      lastnameValue: "",
      isFirstnameValid: true,
      isLastnameValid: true,
      isValid: false,
    },
    password: {
      value: "",
      passwordValue: "",
      confirmPasswordValue: "",
      isPasswordValid: true,
      containsDigit: true,
      containsLower: true,
      containsUpper: true,
      isValidLength: true,
      isConfirmPasswordValid: true,
      isMatching: true,
      isValid: false,
    },
    email: {
      value: "",
      isValid: false,
    },
    phone: {
      value: "",
      isValid: false,
    },
  };
};
