import { Button, CircularProgress, FormHelperText } from "@mui/material";

import { useReducer, useState } from "react";
import {
  getResetPasswordformInitialState,
  resetPasswordFormReducer,
} from "../../../../reducers/resetpasswordform-reducer";

import { sendRequest } from "../../../../utility";
import * as config from "../../../../config";

import InputField from "../../../UI/InputField/InputField";
import AccountDetailsFormCard from "../AccountDetailsCard/AccountDetailsCard";
import AccountDetailsCardActions from "../AccountDetailsCard/AccountDetailsCardActions";
import AccountDetailsCardContent from "../AccountDetailsCard/AccountDetailsCardContent";
import AccountDetailsCardHeader from "../AccountDetailsCard/AccountDetailsCardHeader";

import classes from "./ChangePasswordForm.module.css";

const ChangePasswordForm = ({ setPage }) => {
  const [formState, dispatchFormState] = useReducer(
    resetPasswordFormReducer,
    getResetPasswordformInitialState()
  );
  const [isLoading, setIsLoading] = useState(false);

  const passwordChangeHandler = (e) => {
    dispatchFormState({ type: "PASSWORD_INPUT", value: e.target.value });
  };

  const confirmPasswordChangeHandler = (e) => {
    dispatchFormState({
      type: "CONFIRM_PASSWORD_INPUT",
      value: e.target.value,
    });
  };

  const cancelClickHandler = () => {
    setPage("details");
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      const url = `${config.SERVER_URL}/dj-rest-auth/password/change/`;
      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: {
          new_password1: formState.password.passwordValue,
          new_password2: formState.password.confirmPasswordValue,
        },
      };

      const response = await sendRequest(url, options, setIsLoading);

      if (response.status >= 300 || !response.status) throw Error;
      else setPage("details");
    } catch (e) {
      setPage("error");
    }
  };

  return (
    <AccountDetailsFormCard onSubmit={formSubmitHandler}>
      <AccountDetailsCardHeader>
        Please enter your new password
      </AccountDetailsCardHeader>
      <AccountDetailsCardContent>
        <InputField
          className={classes.input}
          label="New Password"
          type="password"
          name="password"
          value={formState.password.passwordValue}
          onBlur={passwordChangeHandler}
          onChange={passwordChangeHandler}
          error={
            !formState.password.isValidLength ||
            !formState.password.containsLower ||
            !formState.password.containsUpper ||
            !formState.password.containsDigit
          }
          required={true}
        />
        <div className={classes["helper-text-container"]}>
          <FormHelperText
            className={classes["helper-text"]}
            error={!formState.password.isValidLength}
          >
            - Password should be between 8 and 32 characters
          </FormHelperText>
          <FormHelperText
            className={classes["helper-text"]}
            error={!formState.password.containsLower}
          >
            - Password should contain at least one lowercase
          </FormHelperText>
          <FormHelperText
            className={classes["helper-text"]}
            error={!formState.password.containsUpper}
          >
            - Password should contain at least one uppercase
          </FormHelperText>
          <FormHelperText
            className={classes["helper-text"]}
            error={!formState.password.containsDigit}
          >
            - Password should contain at least one digit
          </FormHelperText>
        </div>
        <InputField
          className={classes.input}
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formState.password.confirmPasswordValue}
          onBlur={confirmPasswordChangeHandler}
          onChange={confirmPasswordChangeHandler}
          error={!formState.password.isConfirmPasswordValid}
          required={true}
        />
      </AccountDetailsCardContent>
      <AccountDetailsCardActions>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!formState.isFormValid}
          className={classes.btn}
        >
          {isLoading ? <CircularProgress size="1.5rem" /> : "Change"}
        </Button>
        <Button
          variant="contained"
          size="large"
          color="warning"
          onClick={cancelClickHandler}
          className={`${classes.btn} ${classes["btn-cancel"]}`}
        >
          Cancel
        </Button>
      </AccountDetailsCardActions>
    </AccountDetailsFormCard>
  );
};

export default ChangePasswordForm;
