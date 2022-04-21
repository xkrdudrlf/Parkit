import classes from "./MyCars.module.css";

import { Typography, Paper, CircularProgress, Button } from "@mui/material";

import { useContext, useEffect, useState } from "react";

import { sendRequest } from "../../../utility";
import * as config from "../../../config";
import GeneralDataGrid from "../../UI/GeneralDataGrid/GeneralDataGrid";
import AccountModalContext from "../../../contexts/account-modal-context";

const MyCars = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    value: false,
    message: "",
  });
  const [cars, setCars] = useState([]);
  const accountModalContext = useContext(AccountModalContext);

  useEffect(() => {
    document.title = "My Cars";

    const fetchData = async () => {
      const authToken = localStorage.getItem("parkItAuthToken");

      try {
        const url = `${config.SERVER_URL}/api/consumer/vehicle/all`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        const fetchedCars = [];
        for (const car of response.data) {
          fetchedCars.push({
            id: car.pk,
            carYear: car.carYear,
            carMake: car.carMake,
            carModel: car.carModel,
            carColour: car.carColour,
            carRego: car.carRego,
          });
        }

        setCars(fetchedCars);
      } catch (e) {
        setError({ value: true, message: config.NETWORK_ERROR_MESSAGE });
      }
    };
    fetchData();
  }, [accountModalContext.pageRefreshStatus]);

  const addCarHandler = () => {
    accountModalContext.openPage("/addCar", "small");
  };

  const clickCarRowHandler = (rowData) => {
    accountModalContext.setContent(rowData.row);
    accountModalContext.openPage("/editCar", "small");
  };

  return (
    <>
      <div className={classes.header}>
        <Typography variant="sectionTitle">My Cars</Typography>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={addCarHandler}
        >
          Add Car
        </Button>
      </div>
      <Paper variant="accountSectionContent">
        {isLoading && <CircularProgress style={{ color: "var(--green)" }} />}
        {!isLoading && !error.value && (
          <GeneralDataGrid
            rows={cars}
            columns={[
              {
                field: "carYear",
                headerName: "Year",
                flex: 1,
              },
              {
                field: "carMake",
                headerName: "Manufacturer",
                flex: 1,
              },
              {
                field: "carModel",
                headerName: "Model",
                flex: 1,
              },
              {
                field: "carColour",
                headerName: "Colour",
                flex: 1,
              },
              {
                field: "carRego",
                headerName: "Registration Number",
                flex: 1,
              },
            ]}
            rowsPerPageOptions={[5, 10]}
            onRowClick={clickCarRowHandler}
            helperText={"* Click a row to edit the details of a car"}
          />
        )}
        {!isLoading && error.value && error.message}
      </Paper>
    </>
  );
};

export default MyCars;
