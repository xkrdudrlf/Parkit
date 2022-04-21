import classes from "./ProviderMapView.module.css";

import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { Scrollbars } from "react-custom-scrollbars-2";
import {
  Button,
  Tab,
  Tabs,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

// React Icon import
import ListAltIcon from "@mui/icons-material/ListAlt";
import MapIcon from "@mui/icons-material/Map";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import ArchiveIcon from "@mui/icons-material/Archive";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";

import ProviderModalContext from "../../../contexts/provider-modal-context";
import CarSpaceMap from "../../UI/LeafletUI/CarSpaceMap/CarSpaceMap";
import CarSpaceMapViewItem from "../../UI/CarSpaceUI/CarSpaceMapViewItem/CarSpaceMapViewItem";

const ProviderMapView = ({ status }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ value: false, message: "" });
  const [carSpaces, setCarSpaces] = useState([]);
  const providerModalContext = useContext(ProviderModalContext);
  const [center, setCenter] = useState([-33.9139982, 151.2418546]);
  const [selectedMapItemIdx, setSelectedMapItemIdx] = useState(-1);

  const location = useLocation();
  // To show label under tabs
  const activeTabView = location.pathname.split("/")[2] ?? false;
  const activeTabListings = location.pathname.split("/")[3] ?? false;

  // Redirection links
  const providerViewURL = location.pathname.split("/").slice(0, 3).join("/");
  const activeUrl = `${providerViewURL}/active`;
  const pendingUrl = `${providerViewURL}/pending`;
  const rejectedUrl = `${providerViewURL}/rejected`;
  const cancelledUrl = `${providerViewURL}/cancelled`;

  const addCarSpaceHandler = () => {
    providerModalContext.openPage("/add");
  };

  const clickCarSpaceHandler = (longitude, latitude, mapItemIdx) => {
    setSelectedMapItemIdx(mapItemIdx);

    setTimeout(() => {
      setCenter([longitude, latitude]);
    }, 5000);

    providerModalContext.openPage("/info", mapItemIdx);
  };

  useEffect(() => {
    document.title = "Provider Map";

    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("parkItAuthToken");
        const url = `${config.SERVER_URL}/api/provider/parking/${status}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        const data = response.data;
        if (data.length > 0) setCenter([data[0].longitude, data[0].latitude]);

        setCarSpaces(data);
      } catch (e) {
        setError({
          value: true,
          message: config.NETWORK_ERROR_MESSAGE,
        });
      }
    };

    fetchData();
  }, [status, providerModalContext.carSpacesRefreshStatus]);

  return (
    <div className={classes.bodyContainer}>
      <div className={classes.menuContainer}>
        <Typography
          variant="modalTitle"
          className={classes.title}
          color="textSecondary"
          fontWeight="Bold"
        >
          Your Car Spaces
        </Typography>
        <div className={classes.viewSelection}>
          <Tabs
            value={activeTabView}
            orientation="horizontal"
            className={classes.tabContainer}
          >
            <Tab
              className={classes.menu__tab}
              component={Link}
              to="/provider/mapView/active"
              value="mapView"
              label="Map"
              icon={<MapIcon className={classes["tab-icon"]} />}
              iconPosition="start"
            />
            <Tab
              className={classes.menu__tab}
              component={Link}
              to="/provider/listView/active"
              value="listView"
              label="List"
              icon={<ListAltIcon className={classes["tab-icon"]} />}
              iconPosition="start"
            />
          </Tabs>
          <Divider
            orientation="vertical"
            variant="middle"
            className={classes.navbar_divider_betweenTabs}
          />
          <Tabs
            value={activeTabListings}
            orientation="horizontal"
            className={classes.tabContainer}
            variant="scrollable"
            scrollButtons={true}
          >
            <Tab
              className={classes.menu__tab}
              component={Link}
              to={activeUrl}
              value="active"
              label="active"
              icon={<BeenhereIcon className={classes["tab-icon"]} />}
              iconPosition="start"
            />
            <Tab
              className={classes.menu__tab}
              component={Link}
              to={pendingUrl}
              value="pending"
              label="pending"
              icon={<ArchiveIcon className={classes["tab-icon"]} />}
              iconPosition="start"
            />
            <Tab
              className={classes.menu__tab}
              component={Link}
              to={rejectedUrl}
              value="rejected"
              label="rejected"
              icon={<ThumbDownIcon className={classes["tab-icon"]} />}
              iconPosition="start"
            />
            <Tab
              className={classes.menu__tab}
              component={Link}
              to={cancelledUrl}
              value="cancelled"
              label="cancelled"
              icon={<DoDisturbAltIcon className={classes["tab-icon"]} />}
              iconPosition="start"
            />
          </Tabs>
        </div>
        <div className={classes.listingContainer}>
          <Divider
            orientation="horizontal"
            className={classes.navbar_divider_listingStart}
          />
          <Scrollbars
            renderView={(props) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  overflowX: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              />
            )}
            renderTrackHorizontal={(props) => (
              <div {...props} style={{ display: "none" }} className="view" />
            )}
          >
            {isLoading && (
              <div className={classes.center_container}>
                <CircularProgress className={classes.spinner} />
              </div>
            )}
            {!isLoading &&
              !error.value &&
              carSpaces.map((item) => (
                <CarSpaceMapViewItem
                  key={item.pk}
                  id={item.pk}
                  streetAddress={item.streetAddress}
                  notes={item.notes}
                  size={item.size}
                  price={item.price}
                  image={item.images[0].image_data}
                  longitude={item.longitude}
                  latitude={item.latitude}
                  onClick={clickCarSpaceHandler}
                />
              ))}
            {!isLoading && error.value && (
              <div className={classes.center_container}>{error.message}</div>
            )}
          </Scrollbars>
        </div>
      </div>
      <CarSpaceMap
        center={center}
        zoom={config.MAP_ZOOM}
        items={carSpaces}
        selectedItemIdx={selectedMapItemIdx}
      >
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          size="large"
          onClick={addCarSpaceHandler}
        >
          Add Car Space
        </Button>
      </CarSpaceMap>
    </div>
  );
};

export default ProviderMapView;
