import { Button } from "@mui/material";

import AccountDetailsFormCard from "../AccountDetailsCard/AccountDetailsCard";
import AccountDetailsCardActions from "../AccountDetailsCard/AccountDetailsCardActions";
import AccountDetailsCardHeader from "../AccountDetailsCard/AccountDetailsCardHeader";

import classes from "./DeleteAccountSuccess.module.css";
import { useContext } from "react";
import AuthContext from "../../../../contexts/auth-context";

const DeleteAccountSuccess = () => {
  const authContext = useContext(AuthContext);

  const clickHandler = () => {
    authContext.logout();
  };

  return (
    <AccountDetailsFormCard>
      <AccountDetailsCardHeader>
        Your account has been successfully deleted
      </AccountDetailsCardHeader>
      <AccountDetailsCardActions>
        <Button
          variant="contained"
          size="large"
          className={classes.btn}
          onClick={clickHandler}
        >
          OK
        </Button>
      </AccountDetailsCardActions>
    </AccountDetailsFormCard>
  );
};

export default DeleteAccountSuccess;
