import classes from "./Favourites.module.css";

import { Typography, Paper, CircularProgress } from "@mui/material";

import { useContext, useEffect, useState } from "react";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";
import AccountModalContext from "../../../contexts/account-modal-context";
import GeneralDataGrid from "../../UI/GeneralDataGrid/GeneralDataGrid";

const Favourites = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    value: false,
    message: "",
  });
  const [favSpots, setFavSpots] = useState([]);
  const accountModalContext = useContext(AccountModalContext);

  const clickCarRowHandler = (rowData) => {
    accountModalContext.setContent(rowData.row);
    accountModalContext.setFavourite({
      id: rowData.row.id,
      value: true,
    });
    accountModalContext.openPage("/favourites", "medium");
  };

  useEffect(() => {
    document.title = "Favourites";

    const fetchData = async () => {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      try {
        const url = `${config.SERVER_URL}/api/consumer/favourite/all`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        const favSpots = [];
        for (const fav of response.data) {
          favSpots.push({
            id: fav.pk,
            carSpaceId: fav.parkingSpace,
            cost: fav.cost,
            streetAddress: `${fav.streetAddress}, ${fav.city}, ${fav.state}`,
            vehicle: fav.parkingSpaceSize,
            notes: fav.notes,
          });
        }
        setFavSpots(favSpots);
      } catch (e) {
        setError({ value: true, message: config.NETWORK_ERROR_MESSAGE });
      }
    };
    fetchData();
  }, [
    accountModalContext.pageRefreshStatus,
    accountModalContext.favourite.value,
  ]);

  return (
    <>
      <div className={classes.header}>
        <Typography variant="sectionTitle">Favourite Car Spots</Typography>
      </div>
      <Paper variant="accountSectionContent">
        {isLoading && <CircularProgress style={{ color: "var(--green)" }} />}
        {!isLoading && !error.value && (
          <GeneralDataGrid
            rows={favSpots}
            columns={[
              {
                field: "streetAddress",
                headerName: "Address",
                flex: 1,
              },
              {
                field: "cost",
                headerName: "Cost",
                flex: 1,
              },
              {
                field: "vehicle",
                headerName: "Car Space Size",
                flex: 1,
              },
              {
                field: "notes",
                headerName: "Notes",
                flex: 1,
              },
            ]}
            rowsPerPageOptions={[5, 10]}
            onRowClick={clickCarRowHandler}
          />
        )}
        {!isLoading && error.value && error.message}
      </Paper>
    </>
  );
};

export default Favourites;
