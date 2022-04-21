import classes from "./InputContainer.module.css";

const InputContainer = ({ children, className }) => {
  return <div className={`${classes.container} ${className}`}>{children}</div>;
};

export default InputContainer;
