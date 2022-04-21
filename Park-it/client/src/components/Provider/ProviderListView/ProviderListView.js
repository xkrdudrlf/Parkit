import classes from "./ProviderListView.module.css";

import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  Button,
  Paper,
  Tab,
  Tabs,
  Typography,
  Divider,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MapIcon from "@mui/icons-material/Map";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import ArchiveIcon from "@mui/icons-material/Archive";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";
import ProviderListItem from "./ProviderListItem";
import ProviderModalContext from "../../../contexts/provider-modal-context";

document.title = "Provider List";

const ProviderListView = ({ status }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ value: false, message: "" });
  const [carSpaces, setCarSpaces] = useState([]);
  const [listItemCount, setListItemCount] = useState(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const providerModalContext = useContext(ProviderModalContext);

  const activeTabView = location.pathname.split("/")[2] ?? false;
  const activeTabListings = location.pathname.split("/")[3] ?? false;

  const providerViewURL = location.pathname.split("/").slice(0, 3).join("/");
  const activeUrl = `${providerViewURL}/active`;
  const pendingUrl = `${providerViewURL}/pending`;
  const rejectedUrl = `${providerViewURL}/rejected`;
  const cancelledUrl = `${providerViewURL}/cancelled`;

  const changePageHandler = (event, newPage) => {
    setPage(newPage);
  };

  const changeRowsPerPageHandler = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addCarSpaceHandler = () => {
    providerModalContext.openPage("/add");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("parkItAuthToken");

        const url = `${
          config.SERVER_URL
        }/api/provider/parking/${status}?limit=${rowsPerPage}&offset=${
          page * rowsPerPage
        }`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        setCarSpaces(response.data.results);
        setListItemCount(response.data.count);
      } catch (e) {
        setError({
          value: true,
          message: config.NETWORK_ERROR_MESSAGE,
        });
      }
    };

    fetchData();
  }, [status, page, rowsPerPage, providerModalContext.carSpacesRefreshStatus]);

  return (
    <Paper variant="sectionBody">
      <div className={classes["navbar-container"]}>
        <Tabs
          value={activeTabView}
          orientation="vertical"
          className={classes.navbar}
        >
          <Tab
            className={classes.navbar__tab}
            variant="sideMenu"
            component={Link}
            to="/provider/listView/active"
            value="listView"
            label="List View"
            icon={<ListAltIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            variant="sideMenu"
            component={Link}
            to="/provider/mapView/active"
            value="mapView"
            label="Map View"
            icon={<MapIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />
        </Tabs>
        <Divider sx={{ my: 1 }} className={classes["navbar-divider"]} />
        <Tabs
          value={activeTabListings}
          orientation="vertical"
          className={classes.navbar}
        >
          <Tab
            className={classes.navbar__tab}
            variant="sideMenu"
            component={Link}
            to={activeUrl}
            value="active"
            label="Active Listings"
            icon={<BeenhereIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            variant="sideMenu"
            component={Link}
            to={pendingUrl}
            value="pending"
            label="Pending Listings"
            icon={<ArchiveIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            variant="sideMenu"
            component={Link}
            to={rejectedUrl}
            value="rejected"
            label="Rejected Listings"
            icon={<ThumbDownIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />

          <Tab
            className={classes.navbar__tab}
            variant="sideMenu"
            component={Link}
            to={cancelledUrl}
            value="cancelled"
            label="Cancelled Listings"
            icon={<DoDisturbAltIcon className={classes["tab-icon"]} />}
            iconPosition="start"
          />
        </Tabs>
      </div>
      <Paper variant="sectionContent">
        <div className={classes.sectionContent__title}>
          <Typography variant="sectionTitle">Car Space Listings</Typography>
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={addCarSpaceHandler}
          >
            Add Car Space
          </Button>
        </div>
        <Paper
          variant="sectionContentBody"
          className={classes.sectionContent__body}
        >
          {isLoading && (
            <div className={classes["center-container"]}>
              <CircularProgress className={classes.spinner} />
            </div>
          )}
          {!isLoading &&
            !error.value &&
            carSpaces.map((item) => (
              <ProviderListItem
                key={item.pk}
                id={item.pk}
                streetAddress={item.streetAddress}
                notes={item.notes}
                size={item.size}
                price={item.price}
                image={item.images[0].image_data}
              />
            ))}
          {!isLoading && error.value && (
            <div className={classes["center-container"]}>{error.message}</div>
          )}

          <TablePagination
            className={classes.pagination}
            component="div"
            count={listItemCount}
            page={page}
            onPageChange={changePageHandler}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[3]}
            onRowsPerPageChange={changeRowsPerPageHandler}
          />
        </Paper>
      </Paper>
    </Paper>
  );
};

export default ProviderListView;
