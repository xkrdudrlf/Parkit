export const detailsformStateReducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case "FETCH":
      const fetchedNewState = {
        isFormValid: true,
        phoneNumber: { value: action.value.phone_number || "", isValid: true },
        accountName: { value: action.value.account_name || "", isValid: true },
        bsb: { value: action.value.bsb || "", isValid: true },
        accountNumber: {
          value: action.value.account_number || "",
          isValid: true,
        },
        cardNumber: { value: action.value.card_number || "", isValid: true },
        expiryDate: { value: action.value.expiry_date || "", isValid: true },
        cvc: { value: action.value.cvc || "", isValid: true },
        bankDetails: { isValid: true },
        paymentDetails: { isValid: true },
      };
      return fetchedNewState;
    case "PHONENUMBER_INPUT":
      newState.phoneNumber.value = action.value;
      newState.phoneNumber.isValid =
        action.value.match(/^\d+$/) && action.value.length === 10;
      if (action.value.length === 0) newState.phoneNumber.isValid = true;
      break;
    case "ACCOUNTNAME_INPUT":
      newState.accountName.value = action.value;
      newState.accountName.isValid = action.value.match(/^[a-zA-Z ]+$/);
      if (action.value.length === 0) newState.accountName.isValid = true;
      break;
    case "BSB_INPUT":
      newState.bsb.value = action.value;
      newState.bsb.isValid =
        action.value.match(/^\d+$/) && action.value.length === 6;
      if (action.value.length === 0) newState.bsb.isValid = true;
      break;
    case "ACCOUNTNUMBER_INPUT":
      newState.accountNumber.value = action.value;
      newState.accountNumber.isValid =
        action.value.match(/^\d+$/) && action.value.length === 9;
      if (action.value.length === 0) newState.accountNumber.isValid = true;
      break;
    case "CARDNUMBER_INPUT":
      newState.cardNumber.value = action.value;
      newState.cardNumber.isValid =
        action.value.match(/^\d+$/) && action.value.length === 16;
      if (action.value.length === 0) newState.cardNumber.isValid = true;
      break;
    case "EXPIRYDATE_INPUT":
      newState.expiryDate.value = action.value;
      if (action.value.length === 0) {
        newState.expiryDate.isValid = true;
        break;
      }

      newState.expiryDate.isValid = false;

      if (!action.value.match(/^\d{2}\/\d{2}$/)) break;

      const now = new Date();
      const currYear = now.getFullYear() - 2000;
      const currMonth = now.getMonth() + 1;

      const [enteredMonth, enteredYear] = action.value.split("/");
      if (enteredYear < currYear) break;
      if (enteredMonth < currMonth && +enteredYear === currYear) break;
      if (12 < enteredMonth) break;

      newState.expiryDate.isValid = true;
      break;
    case "CVC_INPUT":
      newState.cvc.value = action.value;
      newState.cvc.isValid =
        action.value.match(/^\d+$/) && action.value.length === 3;
      if (action.value.length === 0) newState.cvc.isValid = true;
      break;
    default:
      console.log("Should not reach HERE");
  }

  // Bank Account Detilas Group Validity Check
  if (
    newState.accountName.value === "" &&
    newState.bsb.value === "" &&
    newState.accountNumber.value === ""
  ) {
    newState.bankDetails.isValid = true;
  } else if (
    newState.accountName.value !== "" &&
    newState.bsb.value !== "" &&
    newState.accountNumber.value !== ""
  ) {
    newState.bankDetails.isValid =
      newState.accountName.isValid &&
      newState.bsb.isValid &&
      newState.accountNumber.isValid;
  } else {
    newState.bankDetails.isValid = false;
  }

  // Payment Detilas Group Validity Check
  if (
    newState.cardNumber.value === "" &&
    newState.expiryDate.value === "" &&
    newState.cvc.value === ""
  ) {
    newState.paymentDetails.isValid = true;
  } else if (
    newState.cardNumber.value !== "" &&
    newState.expiryDate.value !== "" &&
    newState.cvc.value !== ""
  ) {
    newState.paymentDetails.isValid =
      newState.cardNumber.isValid &&
      newState.expiryDate.isValid &&
      newState.cvc.isValid;
  } else {
    newState.paymentDetails.isValid = false;
  }

  newState.isFormValid =
    newState.phoneNumber.isValid &&
    newState.bankDetails.isValid &&
    newState.paymentDetails.isValid;

  return newState;
};

export const getDetailsformInitialState = () => {
  return {
    isFormValid: false,
    phoneNumber: { value: "", isValid: false },
    bankDetails: { isValid: false },
    accountName: { value: "", isValid: false },
    bsb: { value: "", isValid: false },
    accountNumber: { value: "", isValid: false },
    paymentDetails: { isValid: false },
    cardNumber: { value: "", isValid: false },
    expiryDate: { value: "", isValid: false },
    cvc: { value: "", isValid: false },
  };
};
