import classes from "./AccountDetailsForm.module.css";

import { sendRequest } from "../../../../utility";
import * as config from "../../../../config";

import { useContext, useEffect, useReducer, useState } from "react";
import {
  detailsformStateReducer,
  getDetailsformInitialState,
} from "../../../../reducers/detailsform-reducer";

import { Button, CircularProgress, InputLabel } from "@mui/material";

import AccountDetailsEntry from "./AccountDetailsEntry";
import AccountDetailsFormInput from "./AccountDetailsFormInput";
import AuthContext from "../../../../contexts/auth-context";

const AccountDetailsForm = ({ details, setPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchForm] = useReducer(
    detailsformStateReducer,
    getDetailsformInitialState()
  );
  const authContext = useContext(AuthContext);

  useEffect(() => {
    dispatchForm({ type: "FETCH", value: details });
  }, [details]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = {};
    for (const [key, value] of form.entries()) {
      if (value === "") continue;
      formData[key] = value;
    }

    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      const url = `${config.SERVER_URL}/dj-rest-auth/user/`;
      const options = {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: formData,
      };

      const response = await sendRequest(url, options, setIsLoading);
      if (response.status >= 300 || !response.status) throw Error;

      authContext.setUserInfo(response.data);
    } catch (e) {
      setPage("error");
    }
  };

  const changePasswordHandler = () => {
    setPage("changePassword");
  };

  const deleteAccountHandler = () => {
    setPage("deleteAccount");
  };

  return (
    <form className={classes.form} onSubmit={formSubmitHandler}>
      <div className={classes.row}>
        <div className={classes["col-horizontal"]}>
          <AccountDetailsEntry label={"Username"} value={details.username} />
          <div className={classes.col}>
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
              size="small"
              onClick={changePasswordHandler}
            >
              Change Password
            </Button>
          </div>
        </div>
        <div className={classes["col-horizontal"]}>
          <AccountDetailsEntry label={"Firstname"} value={details.first_name} />
          <AccountDetailsEntry label={"Lastname"} value={details.last_name} />
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes["col-horizontal"]}>
          <AccountDetailsEntry label={"Email Address"} value={details.email} />
        </div>
        <div className={classes["col-horizontal"]}>
          <AccountDetailsFormInput
            id={"phone"}
            name={"phone_number"}
            label={"Phone number"}
            type={"text"}
            value={formState.phoneNumber.value}
            isValid={formState.phoneNumber.isValid}
            validCondition={"* 10 digits"}
            onChange={(e) =>
              dispatchForm({ type: "PHONENUMBER_INPUT", value: e.target.value })
            }
          />
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes.col}>
          <InputLabel className={classes.label}>
            Bank Account Details
          </InputLabel>
          <div className={classes["col-horizontal"]}>
            <AccountDetailsFormInput
              id={"accountName"}
              name={"account_name"}
              label={"Account Name"}
              type={"text"}
              value={formState.accountName.value}
              isValid={formState.accountName.isValid}
              validCondition={"* alphabets and spaces"}
              onChange={(e) =>
                dispatchForm({
                  type: "ACCOUNTNAME_INPUT",
                  value: e.target.value,
                })
              }
            />
            <AccountDetailsFormInput
              id={"bsb"}
              name={"bsb"}
              label={"BSB"}
              type={"text"}
              value={formState.bsb.value}
              isValid={formState.bsb.isValid}
              validCondition={"* 6 digits"}
              onChange={(e) =>
                dispatchForm({ type: "BSB_INPUT", value: e.target.value })
              }
              componentsProps={{ input: { minLength: 6, maxLength: 6 } }}
            />
            <AccountDetailsFormInput
              id={"accountNumber"}
              name={"account_number"}
              label={"Account Number"}
              type={"text"}
              value={formState.accountNumber.value}
              isValid={formState.accountNumber.isValid}
              validCondition={"* 9 digits"}
              onChange={(e) =>
                dispatchForm({
                  type: "ACCOUNTNUMBER_INPUT",
                  value: e.target.value,
                })
              }
              componentsProps={{ input: { minLength: 9, maxLength: 9 } }}
            />
          </div>
        </div>
        <div className={classes.col}>
          <InputLabel className={classes.label}>Payment Details</InputLabel>
          <div className={classes["col-horizontal"]}>
            <AccountDetailsFormInput
              id={"cardNumber"}
              name={"card_number"}
              label={"Card Number"}
              type={"text"}
              value={formState.cardNumber.value}
              isValid={formState.cardNumber.isValid}
              validCondition={"* 16 digits"}
              onChange={(e) =>
                dispatchForm({
                  type: "CARDNUMBER_INPUT",
                  value: e.target.value,
                })
              }
              componentsProps={{ input: { minLength: 16, maxLength: 16 } }}
            />
            <div className={classes["col-horizontal"]}>
              <AccountDetailsFormInput
                id={"month"}
                name={"expiry_date"}
                label={"Expiry Date"}
                type={"string"}
                placeholder={"MM/YY"}
                value={formState.expiryDate.value}
                isValid={formState.expiryDate.isValid}
                validCondition={"* MM/YY"}
                onChange={(e) =>
                  dispatchForm({
                    type: "EXPIRYDATE_INPUT",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <AccountDetailsFormInput
              id={"cvc"}
              name={"cvc"}
              label={"CVC"}
              type={"password"}
              value={formState.cvc.value}
              isValid={formState.cvc.isValid}
              validCondition={"* 3 digits"}
              onChange={(e) =>
                dispatchForm({ type: "CVC_INPUT", value: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className={`${classes["last-row"]}`}>
        <Button
          className={classes.button}
          color="error"
          variant="contained"
          size="small"
          onClick={deleteAccountHandler}
        >
          Delete Account
        </Button>
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          size="small"
          type="submit"
          disabled={!formState.isFormValid}
        >
          {isLoading && (
            <CircularProgress className={classes.spinner} size="1.5rem" />
          )}
          {!isLoading && "Update"}
        </Button>
      </div>
    </form>
  );
};

export default AccountDetailsForm;
