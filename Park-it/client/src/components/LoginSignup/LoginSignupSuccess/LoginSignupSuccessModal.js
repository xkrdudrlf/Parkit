import { Button } from "@mui/material";
import LoginSignupModalActions from "../LoginSignupModal/LoginSignupModalActions";
import LoginSignupModalContent from "../LoginSignupModal/LoginSignupModalContent";
import LoginSignupModalHeader from "../LoginSignupModal/LoginSignupModalHeader";
import classes from "./LoginSignupSuccessModal.module.css";

const LoginSignupSuccessModal = ({
  title,
  children,
  buttonContent,
  onClose,
}) => {
  return (
    <>
      <LoginSignupModalHeader title={title} onClose={onClose} />
      <LoginSignupModalContent className={classes.content}>
        {children}
      </LoginSignupModalContent>
      <LoginSignupModalActions>
        <Button
          size="large"
          variant="contained"
          className={classes["confirm-btn"]}
          onClick={onClose}
        >
          {buttonContent}
        </Button>
      </LoginSignupModalActions>
    </>
  );
};

export default LoginSignupSuccessModal;
