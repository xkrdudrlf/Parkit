import { useState } from "react";
import InputField from "../../UI/InputField/InputField";
import classes from "./SignupEmailInput.module.css";

const SignupEmailInput = ({ state, onChange }) => {
  const [beforeInput, setBeforeInput] = useState(true);
  const emailChangeHandler = (e) => {
    setBeforeInput(false);
    onChange({ type: "EMAIL_INPUT", value: e.target.value });
  };

  return (
    <div className={classes["email-form"]}>
      <InputField
        id="input-signup-email"
        label="Email address"
        type="email"
        size="small"
        value={state.value}
        onBlur={emailChangeHandler}
        onChange={emailChangeHandler}
        error={!beforeInput && !state.isValid}
        required={true}
      />
    </div>
  );
};
export default SignupEmailInput;
