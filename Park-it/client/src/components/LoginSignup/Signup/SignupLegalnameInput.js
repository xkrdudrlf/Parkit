import InputField from "../../UI/InputField/InputField";
import classes from "./SignupLegalnameInput.module.css";

const SignupLegalnameInput = ({ state, onChange }) => {
  const firstnameChangeHandler = (e) => {
    onChange({ type: "FIRSTNAME_INPUT", value: e.target.value });
  };
  const lastnameChangeHandler = (e) => {
    onChange({ type: "LASTNAME_INPUT", value: e.target.value });
  };

  return (
    <div className={classes["legalname-input"]}>
      <InputField
        id="input-signup-firstname"
        label="First name"
        type="text"
        size="small"
        value={state.firstnameValue}
        onBlur={firstnameChangeHandler}
        onChange={firstnameChangeHandler}
        error={!state.isFirstnameValid}
        required={true}
      />
      <InputField
        id="input-signup-lastname"
        label="Last name"
        type="text"
        size="small"
        value={state.lastnameValue}
        onBlur={lastnameChangeHandler}
        onChange={lastnameChangeHandler}
        error={!state.isLastnameValid}
        required={true}
      />
    </div>
  );
};

export default SignupLegalnameInput;
