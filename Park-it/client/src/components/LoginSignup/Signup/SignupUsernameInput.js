import { FormHelperText } from "@mui/material";
import { useState } from "react";

import InputField from "../../UI/InputField/InputField";
import classes from "./SignupUsernameInput.module.css";

const SignupUsernameInput = ({ state, onChange }) => {
  const [beforeInput, setBeforeInput] = useState(true);

  const usernameChangeHandler = (e) => {
    setBeforeInput(false);
    onChange({ type: "USERNAME_INPUT", value: e.target.value });
  };

  return (
    <div className={classes["username-form"]}>
      <InputField
        id="input-signup-username"
        label="Username"
        type="text"
        size="small"
        value={state.value}
        onBlur={usernameChangeHandler}
        onChange={usernameChangeHandler}
        required={true}
        error={!beforeInput && !state.isValid}
      />
      <FormHelperText
        className={classes["form-helper-text"]}
        error={!beforeInput && !state.isValid}
      >
        - Username should be less than 20 characters
      </FormHelperText>
    </div>
  );
};

export default SignupUsernameInput;
