import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  CircularProgress,
  FormHelperText,
  Link as MuiLink,
} from "@mui/material";
import InputField from "../../UI/InputField/InputField";

import classes from "./LoginForm.module.css";

import LoginSignupModalForm from "../LoginSignupModal/LoginSignupModalForm";
import LoginSignupModalActions from "../LoginSignupModal/LoginSignupModalActions";
import LoginSignupModalContent from "../LoginSignupModal/LoginSignupModalContent";
import AuthContext from "../../../contexts/auth-context";
import LoginSignupModalHeader from "../LoginSignupModal/LoginSignupModalHeader";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";

const LoginForm = ({ onClose }) => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authContext = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginFormSubmitHandler = async (e) => {
    e.preventDefault();

    const url = `${config.SERVER_URL}/dj-rest-auth/login/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      },
    };
    const loginResponse = await sendRequest(url, options, setIsLoading);

    if (loginResponse.status >= 300 || !loginResponse.status) {
      return setError(true);
    }

    const authToken = loginResponse.data.access_token;
    const admin = loginResponse.data.user.is_staff;
    const userInfo = loginResponse.data.user;

    setError(false);
    authContext.login(authToken, admin, userInfo);

    onClose();
  };

  return (
    <>
      <LoginSignupModalHeader title="Log in" onClose={onClose} />
      <LoginSignupModalForm onSubmit={loginFormSubmitHandler}>
        <LoginSignupModalContent>
          <div className={classes.inputs}>
            <InputField
              id="input-login-email"
              label="Email Address"
              type="email"
              inputRef={emailInputRef}
              className={classes.inputField}
            />
            <InputField
              id="input-login-password"
              label="Password"
              type="password"
              inputRef={passwordInputRef}
            />
            <FormHelperText
              error
              style={{ visibility: `${error ? "visible" : "hidden"}` }}
            >
              Incorrect email or password
            </FormHelperText>
          </div>

          <div className={classes.links}>
            <MuiLink color="textSecondary" component={Link} to="/signup">
              New user? Sign up here
            </MuiLink>
            <MuiLink
              color="textSecondary"
              component={Link}
              to="/forgotPassword"
            >
              Forgot Password
            </MuiLink>
          </div>
        </LoginSignupModalContent>
        <LoginSignupModalActions>
          <Button
            className={classes["login-btn"]}
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

export default LoginForm;
