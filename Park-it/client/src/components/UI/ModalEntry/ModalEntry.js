import classes from "./ModalEntry.module.css";

import { Icon } from "@mui/material";

import InputContainer from "../InputContainer/InputContainer";

const ModalEntry = ({
  icon = null,
  children,
  className,
  direction = "column",
}) => {
  const contentClassName =
    direction === "column" ? classes.vertical : classes.horizontal;

  return (
    <InputContainer className={className}>
      {icon && <Icon variant="form" fontSize="large" component={icon} />}
      <div className={contentClassName}>{children}</div>
    </InputContainer>
  );
};

export default ModalEntry;
