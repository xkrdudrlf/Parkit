import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  CircularProgress,
  FormHelperText,
  Typography,
} from "@mui/material";

import InputField from "../../UI/InputField/InputField";
import LoginSignupModalActions from "../LoginSignupModal/LoginSignupModalActions";
import LoginSignupModalContent from "../LoginSignupModal/LoginSignupModalContent";
import LoginSignupModalForm from "../LoginSignupModal/LoginSignupModalForm";
import LoginSignupModalHeader from "../LoginSignupModal/LoginSignupModalHeader";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";

import classes from "./ForgotPasswordForm.module.css";

const ForgotPasswordForm = ({ onClose }) => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const forgotPasswordFormSubmitHandler = async (e) => {
    e.preventDefault();

    const url = `${config.SERVER_URL}/dj-rest-auth/password/reset/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { email: emailInputRef.current.value },
    };
    const response = await sendRequest(url, options, setIsLoading);

    if (response.status >= 300) return setError(true);

    setError(false);
    navigate("/passwordResetEmailSent");
  };

  const backHandler = (e) => {
    navigate("/login");
  };

  return (
    <>
      <LoginSignupModalHeader
        title="Forget Password"
        onBack={backHandler}
        onClose={onClose}
      />
      <LoginSignupModalForm onSubmit={forgotPasswordFormSubmitHandler}>
        <LoginSignupModalContent>
          <Typography variant="modalSubtitle" color="textSecondary">
            Enter your email address and
            <br />
            we'll send you a reset link
          </Typography>
          <InputField
            id={"input-forgetPassword-email"}
            label="Email Address"
            type="email"
            inputRef={emailInputRef}
            className={classes.inputField}
          />
          <FormHelperText
            style={{ visibility: `${error ? "visible" : "hidden"}` }}
            error
          >
            There is no account in the system with the given email address.
          </FormHelperText>
        </LoginSignupModalContent>
        <LoginSignupModalActions>
          <Button
            className={classes["email-btn"]}
            variant="contained"
            size="large"
            type="submit"
          >
            {isLoading && <CircularProgress size={26} />}
            {!isLoading && "Continue"}
          </Button>
        </LoginSignupModalActions>
      </LoginSignupModalForm>
    </>
  );
};

export default ForgotPasswordForm;
