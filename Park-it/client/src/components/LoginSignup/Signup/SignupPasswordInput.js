import { FormHelperText } from "@mui/material";

import InputField from "../../UI/InputField/InputField";
import classes from "./SignupPasswordInput.module.css";

const SignupPasswordInput = ({ state, onChange }) => {
  const passwordChangeHandler = (e) => {
    onChange({ type: "PASSWORD_INPUT", value: e.target.value });
  };

  const confirmPasswordChangeHandler = (e) => {
    onChange({
      type: "CONFIRM_PASSWORD_INPUT",
      value: e.target.value,
    });
  };

  return (
    <div className={classes["signup-password-input"]}>
      <div className={classes.password}>
        <InputField
          id="input-signup-password"
          label="Password"
          type="password"
          size="small"
          value={state.passwordValue}
          onBlur={passwordChangeHandler}
          onChange={passwordChangeHandler}
          error={
            !state.isValidLength ||
            !state.containsLower ||
            !state.containsUpper ||
            !state.containsDigit
          }
          required={true}
        />
        <div className={classes["helper-text-container"]}>
          <FormHelperText
            className={classes["helper-text"]}
            error={!state.isValidLength}
          >
            - Password should be between 8 and 32 characters
          </FormHelperText>
          <FormHelperText
            className={classes["helper-text"]}
            error={!state.containsLower}
          >
            - Password should contain at least one lowercase
          </FormHelperText>
          <FormHelperText
            className={classes["helper-text"]}
            error={!state.containsUpper}
          >
            - Password should contain at least one uppercase
          </FormHelperText>
          <FormHelperText
            className={classes["helper-text"]}
            error={!state.containsDigit}
          >
            - Password should contain at least one digit
          </FormHelperText>
        </div>
      </div>
      <div className={classes["confirm-password"]}>
        <InputField
          id="input-signup-confirmPassword"
          label="Confirm Password"
          type="password"
          size="small"
          value={state.confirmPasswordValue}
          onBlur={confirmPasswordChangeHandler}
          onChange={confirmPasswordChangeHandler}
          error={!state.isConfirmPasswordValid}
          required={true}
        />
      </div>
    </div>
  );
};

export default SignupPasswordInput;
