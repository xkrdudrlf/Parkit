import { Typography } from "@mui/material";

import classes from "./MainHeaderBrand.module.css";

import logo from "../../../assets/logo.svg";

const MainHeaderBrand = () => {
  return (
    <div className={classes.mainHeaderBrand}>
      <img className={classes.logo} src={logo} alt="logo" />
      <Typography variant="brandName" color="textSecondary">
        PARK IT
      </Typography>
    </div>
  );
};

export default MainHeaderBrand;
