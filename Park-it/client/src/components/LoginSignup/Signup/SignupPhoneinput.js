import { FormHelperText } from "@mui/material";
import { useState } from "react";
import InputField from "../../UI/InputField/InputField";
import classes from "./SignupPhoneinput.module.css";

const SignupPhoneinput = ({ state, onChange }) => {
  const [beforeInput, setBeforeInput] = useState(true);
  const phoneChangeHandler = (e) => {
    setBeforeInput(false);
    onChange({ type: "PHONE_INPUT", value: e.target.value });
  };
  return (
    <div className={classes["signup-phone-input"]}>
      <InputField
        id="input-signup-phone"
        label="Phone number"
        type="text"
        size="small"
        value={state.value}
        onBlur={phoneChangeHandler}
        onChange={phoneChangeHandler}
        error={!beforeInput && !state.isValid}
        required={true}
      />
      <FormHelperText error={!beforeInput && !state.isValid}>
        - Phone number should be 10 digits
      </FormHelperText>
    </div>
  );
};

export default SignupPhoneinput;
