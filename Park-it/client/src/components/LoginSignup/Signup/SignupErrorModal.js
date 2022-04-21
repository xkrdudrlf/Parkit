import { Button } from "@mui/material";

import classes from "./SignupErrorModal.module.css";

import GeneralModal from "../../UI/GeneralModal/GeneralModal";
import LoginSignupModalActions from "../LoginSignupModal/LoginSignupModalActions";
import LoginSignupModalContent from "../LoginSignupModal/LoginSignupModalContent";
import LoginSignupModalHeader from "../LoginSignupModal/LoginSignupModalHeader";

const SignupErrorModal = ({ open, onClose, messages }) => {
  return (
    <GeneralModal
      open={open}
      onClose={onClose}
      height="350px"
      width="400px"
      flexDirection="column"
    >
      <LoginSignupModalHeader title="Signup Error" onClose={onClose} />
      <LoginSignupModalContent className={classes.content}>
        {messages.map((message) => {
          return <p key={message}>{message}</p>;
        })}
      </LoginSignupModalContent>
      <LoginSignupModalActions>
        <Button variant="contained" onClick={onClose}>
          OK
        </Button>
      </LoginSignupModalActions>
    </GeneralModal>
  );
};

export default SignupErrorModal;
