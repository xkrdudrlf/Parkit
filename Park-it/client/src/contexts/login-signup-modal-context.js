import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginSignupModalContext = React.createContext({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export const LoginSignupModalContextProvider = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("dj-rest-auth/password/reset/confirm"))
      setIsOpen(true);
  }, [location]);

  const openModal = () => {
    navigate("/login");
    setIsOpen(true);
  };

  const closeModal = () => {
    navigate("/");
    setIsOpen(false);
  };

  const contextValue = {
    isOpen,
    openModal,
    closeModal,
  };

  return (
    <LoginSignupModalContext.Provider value={contextValue}>
      {props.children}
    </LoginSignupModalContext.Provider>
  );
};

export default LoginSignupModalContext;
