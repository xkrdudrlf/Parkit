import { Button, CircularProgress } from "@mui/material";

import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSignupformInitialState,
  signupformStateReducer,
} from "../../../reducers/signupform-reducer";

import LoginSignupModalActions from "../LoginSignupModal/LoginSignupModalActions";
import LoginSignupModalContent from "../LoginSignupModal/LoginSignupModalContent";
import LoginSignupModalForm from "../LoginSignupModal/LoginSignupModalForm";
import SignupEmailInput from "./SignupEmailInput";
import SignupLegalnameInput from "./SignupLegalnameInput";
import SignupPasswordInput from "./SignupPasswordInput";
import SignupUsernameInput from "./SignupUsernameInput";
import SignupPhoneinput from "./SignupPhoneinput";
import LoginSignupModalHeader from "../LoginSignupModal/LoginSignupModalHeader";
import SignupErrorModal from "./SignupErrorModal";

import classes from "./SignupForm.module.css";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";

const SignupForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ value: false, messages: [] });
  const [formState, dispatchFormState] = useReducer(
    signupformStateReducer,
    getSignupformInitialState()
  );

  const signupFormSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = {
      username: formState.username.value,
      email: formState.email.value,
      password1: formState.password.passwordValue,
      password2: formState.password.confirmPasswordValue,
      phone_number: formState.phone.value,
      first_name: formState.legalname.firstnameValue,
      last_name: formState.legalname.lastnameValue,
    };

    const url = `${config.SERVER_URL}/dj-rest-auth/registration/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    };

    const response = await sendRequest(url, options, setIsLoading);

    if (response.status >= 300) {
      let messages = [];
      for (const errorText of Object.values(response.data)) {
        messages.push(errorText);
      }
      setError({ value: true, messages });
      return;
    }

    dispatchFormState({ type: "RESET" });
    navigate("/signupSuccess");
  };

  const signupErrorModalCloseHandler = () => {
    setError({ value: false, messages: [] });
  };

  return (
    <>
      <SignupErrorModal
        open={error.value}
        onClose={signupErrorModalCloseHandler}
        messages={error.messages}
      />
      <LoginSignupModalHeader title="Sign up" onClose={onClose} />
      <LoginSignupModalForm onSubmit={signupFormSubmitHandler}>
        <LoginSignupModalContent className={classes.signupform}>
          <div className={`${classes["row-container"]}`}>
            <SignupUsernameInput
              state={formState.username}
              onChange={dispatchFormState}
            />
            <SignupLegalnameInput
              state={formState.legalname}
              onChange={dispatchFormState}
            />
          </div>

          <SignupPasswordInput
            state={formState.password}
            onChange={dispatchFormState}
          />

          <div
            className={`${classes["row-container"]} ${classes["contact-container"]}`}
          >
            <SignupEmailInput
              state={formState.email}
              onChange={dispatchFormState}
            />
            <SignupPhoneinput
              state={formState.phone}
              onChange={dispatchFormState}
            />
          </div>
        </LoginSignupModalContent>

        <LoginSignupModalActions>
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={!formState.isFormValid}
          >
            {isLoading && <CircularProgress size={26.5} />}
            {!isLoading && "Sign up"}
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={onClose}
            className={classes["btn-cancel"]}
          >
            Cancel
          </Button>
        </LoginSignupModalActions>
      </LoginSignupModalForm>
    </>
  );
};

export default SignupForm;
