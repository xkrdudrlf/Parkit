import { Button, FormHelperText, CircularProgress } from "@mui/material";
import { useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getResetPasswordformInitialState,
  resetPasswordFormReducer,
} from "../../../reducers/resetpasswordform-reducer";
import InputField from "../../UI/InputField/InputField";
import LoginSignupModalActions from "../LoginSignupModal/LoginSignupModalActions";
import LoginSignupModalContent from "../LoginSignupModal/LoginSignupModalContent";
import LoginSignupModalForm from "../LoginSignupModal/LoginSignupModalForm";
import LoginSignupModalHeader from "../LoginSignupModal/LoginSignupModalHeader";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";

import classes from "./ResetPasswordForm.module.css";

const ResetPasswordForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [formState, dispatchFormState] = useReducer(
    resetPasswordFormReducer,
    getResetPasswordformInitialState()
  );
  const [isLoading, setIsLoading] = useState(false);
  const { uid, token } = useParams();

  const passwordChangeHandler = (e) => {
    dispatchFormState({ type: "PASSWORD_INPUT", value: e.target.value });
  };

  const confirmPasswordChangeHandler = (e) => {
    dispatchFormState({
      type: "CONFIRM_PASSWORD_INPUT",
      value: e.target.value,
    });
  };

  const resetPasswordFormSubmitHandler = async (e) => {
    e.preventDefault();

    const url = `${config.SERVER_URL}/dj-rest-auth/password/reset/confirm/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        new_password1: formState.password.passwordValue,
        new_password2: formState.password.confirmPasswordValue,
        uid: uid,
        token: token,
      },
    };
    const response = await sendRequest(url, options, setIsLoading);

    if (response.status >= 300 || !response.status) {
      return alert(response.data);
    }

    navigate("/resetPasswordSuccess");
  };

  return (
    <>
      <LoginSignupModalHeader title="Reset Password" onClose={onClose} />
      <LoginSignupModalForm onSubmit={resetPasswordFormSubmitHandler}>
        <LoginSignupModalContent>
          <div className={classes.inputs}>
            <InputField
              id="input-resetPassword-password"
              label="New Password"
              type="password"
              value={formState.password.passwordValue}
              onBlur={passwordChangeHandler}
              onChange={passwordChangeHandler}
              className={classes.inputField}
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
              id="input-resetPassword-confirmPassword"
              label="Confirm Password"
              type="password"
              value={formState.password.confirmPasswordValue}
              onBlur={confirmPasswordChangeHandler}
              onChange={confirmPasswordChangeHandler}
              error={!formState.password.isConfirmPasswordValid}
              required={true}
            />
          </div>
        </LoginSignupModalContent>
        <LoginSignupModalActions>
          <Button
            className={classes["login-btn"]}
            variant="contained"
            size="large"
            type="submit"
            disabled={!formState.isFormValid}
          >
            {isLoading && <CircularProgress size={26} />}
            {!isLoading && "Continue"}
          </Button>
        </LoginSignupModalActions>
      </LoginSignupModalForm>
    </>
  );
};

export default ResetPasswordForm;
