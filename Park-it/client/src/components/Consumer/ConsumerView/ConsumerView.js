import classes from "./ConsumerView.module.css";

import { useContext, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

import * as utility from "../../../utility";
import * as config from "../../../config";

import AuthContext from "../../../contexts/auth-context";

import { Typography, Divider, CircularProgress } from "@mui/material";

import CarSpaceSearchBar from "../../UI/CarSpaceUI/CarSpaceSearchBar/CarSpaceSearchBar";
import MessageModal from "../../UI/MessageModal/MessageModal";
import SubModalContext from "../../../contexts/submodal-context";
import ConsumerModalContext from "../../../contexts/consumer-modal-context";
import CarSpaceMap from "../../UI/LeafletUI/CarSpaceMap/CarSpaceMap";
import CarSpaceMapViewItem from "../../UI/CarSpaceUI/CarSpaceMapViewItem/CarSpaceMapViewItem";

const ConsumerView = () => {
  const authContext = useContext(AuthContext);
  const subModalContext = useContext(SubModalContext);
  const consumerModalContext = useContext(ConsumerModalContext);
  const [error, setError] = useState({ value: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [center, setCenter] = useState([-33.9139982, 151.2418546]);
  const [queryResults, setQueryResults] = useState([]);
  const [selectedMapItemIdx, setSelectedMapItemIdx] = useState(-1);

  const searchHandler = async (formData) => {
    try {
      setError({
        value: false,
        message: "",
      });

      consumerModalContext.setSearchDate({
        startDate: formData.startDateTime,
        endDate: formData.endDateTime,
      });

      const data = await utility.searchCarSpace(formData, setIsLoading);
      if (data.length === 0) {
        setQueryResults([]);
        setError({
          value: true,
          message: "No matching place found.",
        });
        return;
      }

      setCenter([data[0].longitude, data[0].latitude]);
      setQueryResults(data);
    } catch (e) {
      setError({
        value: true,
        message: config.NETWORK_ERROR_MESSAGE,
      });
    }
  };

  const clickCarSpaceHandler = (longitude, latitude, mapItemIdx) => {
    setSelectedMapItemIdx(mapItemIdx);

    setTimeout(() => {
      setCenter([longitude, latitude]);
    }, 5000);

    if (!authContext.isLoggedIn) {
      subModalContext.openModal({
        title: "Unauthorized",
        messages: ["Please log in to view the details of parking space."],
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeModal,
            content: "OK",
            width: "120px",
          },
        ],
      });
    } else {
      consumerModalContext.openPage("/info", mapItemIdx);
    }
  };

  useEffect(() => {
    document.title = "Consumer View";
    const fetchData = async () => {
      try {
        if (!authContext.searchInfo) return;

        consumerModalContext.setSearchDate({
          startDate: authContext.searchInfo.startDateTime,
          endDate: authContext.searchInfo.endDateTime,
        });

        const data = await utility.searchCarSpace(
          authContext.searchInfo,
          setIsLoading
        );
        if (data.length === 0) {
          setError({
            value: true,
            message: "No matching place found.",
          });
          return;
        }

        setQueryResults(data);
      } catch (e) {
        setError({
          value: true,
          message: config.NETWORK_ERROR_MESSAGE,
        });
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authContext.searchInfo,
    setIsLoading,
    consumerModalContext.setSearchDate,
  ]);

  return (
    <div className={classes.bodyContainer}>
      <MessageModal
        open={subModalContext.isOpen}
        onClose={subModalContext.closeModal}
        title={subModalContext.content.title}
        messages={subModalContext.content.messages}
        actions={subModalContext.content.actions}
      />
      <div className={classes.menuContainer}>
        <Typography
          variant="modalTitle"
          className={classes.title}
          color="textSecondary"
          fontWeight="Bold"
        >
          Car Space Search
        </Typography>
        <div className={classes.interactionSection}>
          <CarSpaceSearchBar
            initialState={authContext.searchInfo}
            onSubmit={searchHandler}
          />
          <Divider
            orientation="horizontal"
            className={classes.navbar_divider_listingStart}
          />
        </div>
        <div className={classes.listingContainer}>
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
              queryResults.map((item) => (
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
        items={queryResults}
        selectedItemIdx={selectedMapItemIdx}
      />
    </div>
  );
};

export default ConsumerView;
