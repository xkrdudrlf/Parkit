import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

const InputField = ({
  id,
  label,
  type,
  value,
  inputRef,
  onChange,
  onBlur,
  size = "large",
  error = false,
  disabled = false,
  required = false,
  className,
  name,
  multiline = false,
  maxRows = 1,
  minRows = 1,
  inputClassName,
  hidden = false,
  multiple = false,
  placeholder,
}) => {
  return (
    <FormControl
      variant="outlined"
      error={error}
      disabled={disabled}
      className={className}
      required={required}
      size={size}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        name={name}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        inputRef={inputRef}
        autoComplete="on"
        multiline={multiline}
        maxRows={maxRows}
        minRows={minRows}
        className={inputClassName}
        hidden={hidden}
        inputProps={{ multiple, hidden }}
        placeholder={placeholder}
      />
    </FormControl>
  );
};

export default InputField;
