import classes from "./Account.module.css";

import { Link, Route, Routes, useLocation } from "react-router-dom";

import { AccountModalContextProvider } from "../../contexts/account-modal-context";
import { SubModalContextProvider } from "../../contexts/submodal-context";

import { Paper, Tab, Tabs } from "@mui/material";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import AccountModal from "./AccountModal/AccountModal";
import AccountDetails from "./AccountDetails/AccountDetails";
import ProviderHistory from "./ProviderHistory/ProviderHistory";
import MyCars from "./MyCars/MyCars";
import ConsumerHistory from "./ConsumerHistory/ConsumerHistory";
import Favourites from "./Favourites/Favourites";
import { useEffect } from "react";

const Account = (props) => {
  const location = useLocation();
  const activeTab = location.pathname.split("/").slice(2).join("/");

  useEffect(() => {
    document.title = "Account Page";
  }, []);

  return (
    <AccountModalContextProvider>
      <Paper className={classes.body}>
        <SubModalContextProvider>
          <AccountModal />
        </SubModalContextProvider>
        <Tabs
          className={classes["navbar"]}
          value={activeTab}
          orientation="vertical"
        >
          <Tab
            className={classes.navbar__tab}
            component={Link}
            to="details"
            value="details"
            label="Account Details"
            icon={
              <ManageAccountsOutlinedIcon className={classes["tab-icon"]} />
            }
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            component={Link}
            to="history/provider"
            value="history/provider"
            label="Provider History"
            icon={<ManageSearchOutlinedIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            component={Link}
            to="history/consumer"
            value="history/consumer"
            label="Consumer Bookings"
            icon={<ManageSearchOutlinedIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            component={Link}
            to="myCars"
            value="myCars"
            label="My Cars"
            icon={<DirectionsCarIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            component={Link}
            to="favourites"
            value="favourites"
            label="Favourites"
            icon={
              <FavoriteBorderOutlinedIcon className={classes["tab-icon"]} />
            }
            iconPosition="start"
          />
        </Tabs>
        <div className={classes.content}>
          <Routes>
            <Route path="details" element={<AccountDetails />} />
            <Route path="history/consumer" element={<ConsumerHistory />} />
            <Route path="history/provider" element={<ProviderHistory />} />
            <Route path="myCars" element={<MyCars />} />
            <Route path="favourites" element={<Favourites />} />
          </Routes>
        </div>
      </Paper>
    </AccountModalContextProvider>
  );
};

export default Account;
