import { Button, CircularProgress, FormHelperText } from "@mui/material";
import { useState } from "react";

import InputField from "../../../UI/InputField/InputField";

import classes from "./AccountDetailsAuthForm.module.css";

import { sendRequest } from "../../../../utility";
import * as config from "../../../../config";
import AccountDetailsFormCard from "../AccountDetailsCard/AccountDetailsCard";
import AccountDetailsCardHeader from "../AccountDetailsCard/AccountDetailsCardHeader";
import AccountDetailsCardContent from "../AccountDetailsCard/AccountDetailsCardContent";
import AccountDetailsCardActions from "../AccountDetailsCard/AccountDetailsCardActions";

const AccountDetailsAuthForm = ({ setPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const authFormSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Get email
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      const getUserDataUrl = `${config.SERVER_URL}/dj-rest-auth/user/`;
      const getUserDataoptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
        },
      };

      setIsLoading(true);
      const getUserDataResponse = await sendRequest(
        getUserDataUrl,
        getUserDataoptions
      );
      if (!getUserDataResponse.status || getUserDataResponse.status >= 300)
        throw Error;

      // Try log in again with email and typed password
      const loginUrl = `${config.SERVER_URL}/dj-rest-auth/login/`;
      const loginOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: {
          email: getUserDataResponse.data.email,
          password: new FormData(e.target).get("password"),
        },
      };
      const loginResponse = await sendRequest(loginUrl, loginOptions);
      setIsLoading(false);

      if (!loginResponse.status) throw Error;

      if (loginResponse.status >= 300) setError(true);
      else setPage("details");
    } catch (e) {
      setPage("error");
    }
  };

  return (
    <AccountDetailsFormCard onSubmit={authFormSubmitHandler}>
      <AccountDetailsCardHeader>
        Please enter your password again
      </AccountDetailsCardHeader>
      <AccountDetailsCardContent>
        <InputField
          className={classes.input}
          label="Password"
          type="password"
          name="password"
        />
        <FormHelperText
          style={{ visibility: `${error ? "visible" : "hidden"}` }}
          error
        >
          * Password is incorrect
        </FormHelperText>
      </AccountDetailsCardContent>
      <AccountDetailsCardActions>
        <Button
          type="submit"
          variant="contained"
          size="large"
          className={classes.btn}
        >
          {isLoading ? <CircularProgress size="1.5rem" /> : "Authenticate"}
        </Button>
      </AccountDetailsCardActions>
    </AccountDetailsFormCard>
  );
};

export default AccountDetailsAuthForm;
