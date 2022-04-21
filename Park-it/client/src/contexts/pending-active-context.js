import React, { useEffect, useState } from "react";

import { sendRequest } from "../utility";
import * as config from "../config";
import { useLocation, useNavigate } from "react-router-dom";

const pendingActiveContext = React.createContext({
  mode: ""
});

export const pendingActiveContextProvider = (props) => {
  const [mode, setMode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!token;

  const loginHandler = (token, admin) => {
    setToken(token);
    setIsAdmin(admin);
    localStorage.setItem("parkItAuthToken", token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("parkItAuthToken");
    navigate("/");
  };

  const contextValue = {
    token: token,
    isAdmin: isAdmin,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    userInfo: userInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default pendingActiveContextProvider;
