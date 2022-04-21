import { InputLabel } from "@mui/material";
import classes from "./AccountDetailsEntry.module.css";

const AccountDetailsEntry = ({ label, value }) => {
  return (
    <div className={classes.body}>
      <InputLabel className={classes.label}>{label}</InputLabel>
      {value}
    </div>
  );
};

export default AccountDetailsEntry;
