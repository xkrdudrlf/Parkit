import { Typography, Paper, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import * as config from "../../../config";
import { sendRequest } from "../../../utility";

import AccountModalContext from "../../../contexts/account-modal-context";
import GeneralDataGrid from "../../UI/GeneralDataGrid/GeneralDataGrid";

const ConsumerHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    value: false,
    message: "",
  });
  const [history, setHistory] = useState([]);
  const accountModalContext = useContext(AccountModalContext);

  const clickCarRowHandler = (rowData) => {
    accountModalContext.setContent(rowData.row);
    accountModalContext.openPage("/consumerBookingInfo");
  };

  useEffect(() => {
    document.title = "Consumer Bookings";

    const fetchData = async () => {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      try {
        const url = `${config.SERVER_URL}/api/consumer/history`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
          },
        };
        const response = await sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;
        const fetchedHistory = [];
        for (const booking of response.data) {
          fetchedHistory.push({
            id: booking.pk,
            publishDate: booking.publishDate,
            carSpaceId: booking.parkingSpace,
            vehicleId: booking.vehicle,
            startTime: booking.startTime,
            endTime: booking.endTime,
            cost: booking.totalCost,
            streetAddress: `${booking.streetAddress}, ${booking.city}, ${booking.state}`,
            vehicle: booking.parkingSpaceSize,
            consumer: booking.consumerName,
          });
        }

        setHistory(fetchedHistory);
      } catch (e) {
        console.log(e.message);
        setError({ value: true, message: config.NETWORK_ERROR_MESSAGE });
      }
    };

    fetchData();
  }, [accountModalContext.pageRefreshStatus]);

  return (
    <>
      <Typography variant="sectionTitle">Consumer Bookings</Typography>
      <Paper variant="accountSectionContent">
        {isLoading && (
          <CircularProgress style={{ color: "var(--green)" }} size="3rem" />
        )}
        {!isLoading && !error.value && (
          <GeneralDataGrid
            rows={history}
            columns={[
              {
                field: "publishDate",
                headerName: "Date",
                width: 150,
              },
              {
                field: "startTime",
                headerName: "Start Time",
                width: 150,
              },
              {
                field: "endTime",
                headerName: "End Time",
                width: 150,
              },
              {
                field: "cost",
                headerName: "Cost",
                widht: 125,
              },
              {
                field: "streetAddress",
                headerName: "Car Space",
                flex: 1,
              },
              {
                field: "consumer",
                headerName: "Consumer",
                width: 150,
              },
            ]}
            rowsPerPageOptions={[5, 10]}
            onRowClick={clickCarRowHandler}
            initialState={{
              sorting: {
                sortModel: [
                  {
                    field: "publishDate",
                    sort: "desc",
                  },
                ],
              },
            }}
            helperText={"* Click a row to see the details of a booking"}
          />
        )}
        {!isLoading && error.message}
      </Paper>
    </>
  );
};

export default ConsumerHistory;
