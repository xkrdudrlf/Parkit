import React, { useEffect, useState } from "react";

import { sendRequest } from "../utility";
import * as config from "../config";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = React.createContext({
  token: "",
  isAdmin: false,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userInfo: null,
  setUserInfo: () => {},
  searchInfo: {},
  setSearchInfo: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setInitialToken = async () => {
      const initialToken = localStorage.getItem("parkItAuthToken");
      if (!initialToken) {
        if (location.pathname.includes("/password/reset/confirm")) return;
        return navigate("/");
      }
      setToken(initialToken);

      const url = `${config.SERVER_URL}/dj-rest-auth/user/`;
      const options = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + initialToken,
        },
      };

      const response = await sendRequest(url, options);

      if (response.status >= 300) {
        setToken(null);
        localStorage.removeItem("parkItAuthToken");
        return navigate("/");
      }

      setToken(initialToken);
      setUserInfo(response.data);
      setIsAdmin(response.data.is_staff);
    };

    setInitialToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoggedIn = !!token;

  const loginHandler = (token, admin, userInfo) => {
    setToken(token);
    setIsAdmin(admin);
    setUserInfo(userInfo);
    setSearchInfo(null);
    localStorage.setItem("parkItAuthToken", token);
  };

  const resetAuth = () => {
    setToken(null);
    setIsAdmin(false);
    setUserInfo(null);
    setSearchInfo(null);
  };

  const logoutHandler = () => {
    resetAuth();
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
    setUserInfo,
    searchInfo,
    setSearchInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
