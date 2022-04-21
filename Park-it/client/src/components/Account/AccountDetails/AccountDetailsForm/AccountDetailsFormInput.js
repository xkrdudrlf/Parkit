import { FormHelperText, Input, InputLabel } from "@mui/material";
import classes from "./AccountDetailsFormInput.module.css";

const AccountDetailsFormInput = ({
  id,
  name,
  label,
  type,
  value,
  isValid,
  validCondition,
  onChange,
  placeholder,
}) => {
  return (
    <div className={classes.body}>
      <InputLabel htmlFor={id} className={classes.label}>
        {label}
      </InputLabel>
      <Input
        className={classes.input}
        id={id}
        name={name}
        type={type}
        value={value}
        error={!isValid}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
      />
      <FormHelperText className={classes["input-helper-text"]} error={!isValid}>
        {validCondition}
      </FormHelperText>
    </div>
  );
};

export default AccountDetailsFormInput;
