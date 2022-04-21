import classes from "./MainHeader.module.css";

import { AppBar, Toolbar } from "@mui/material";

import MainHeaderBrand from "./MainHeaderBrand";
import MainHeaderNavigation from "./MainHeaderNavigation";

const MainHeader = () => {
  return (
    <AppBar
      className={classes.appbar}
      position="static"
      color="container"
      elevation={0}
    >
      <Toolbar className={classes.toolbar}>
        <MainHeaderBrand />
        <MainHeaderNavigation />
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;
