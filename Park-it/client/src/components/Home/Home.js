import classes from "./Home.module.css";

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/auth-context";
import CarSpaceSearchBar from "../UI/CarSpaceUI/CarSpaceSearchBar/CarSpaceSearchBar";

import { Typography } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const formSubmitHandler = async (formData) => {
    authContext.setSearchInfo(formData);
    navigate(`/consumer`);
  };

  useEffect(() => {
    document.title = "Home - Park it !";
  }, []);

  return (
    <div className={classes.body}>
      <div className={classes["search-container"]}>
        <Typography variant="brandName" className={classes.slogan}>
          Just Park It !
        </Typography>
        <CarSpaceSearchBar onSubmit={formSubmitHandler} />
      </div>
    </div>
  );
};

export default Home;
