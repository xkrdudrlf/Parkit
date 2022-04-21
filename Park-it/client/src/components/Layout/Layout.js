import { LoginSignupModalContextProvider } from "../../contexts/login-signup-modal-context";

import LoginSignupModal from "../LoginSignup/LoginSignupModal/LoginSignupModal";
import MainHeader from "./MainHeader/MainHeader";

import classes from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={classes.root}>
      <LoginSignupModalContextProvider>
        <LoginSignupModal />
        <MainHeader />
      </LoginSignupModalContextProvider>
      {children}
    </div>
  );
};

export default Layout;
