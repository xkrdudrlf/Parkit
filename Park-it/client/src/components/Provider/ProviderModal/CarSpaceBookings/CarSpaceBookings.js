import classes from "./CarSpaceBookings.module.css";

import { useContext, useEffect, useState } from "react";

import ProviderModalContext from "../../../../contexts/provider-modal-context";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import { CircularProgress } from "@mui/material";

import GeneralDataGrid from "../../../UI/GeneralDataGrid/GeneralDataGrid";
import CarSpaceCardHeader from "../../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardHeader";
import CarSpaceCardContent from "../../../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardContent";

const CarSpaceBookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    value: false,
    message: "",
  });
  const [bookings, setBookings] = useState([]);
  const providerModalContext = useContext(ProviderModalContext);

  const backToCarSpaceInfoHandler = () => {
    providerModalContext.openPage("/info");
  };

  const clickCarRowHandler = (rowData) => {
    providerModalContext.setBookingInfo(rowData.row);
    providerModalContext.openPage("/booking");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("parkItAuthToken");
        const url = `${config.SERVER_URL}/api/provider/parking/bookings/${providerModalContext.carSpaceId}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await utility.sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        const fecthedBookings = [];
        for (const booking of response.data) {
          fecthedBookings.push({
            id: booking.pk,
            publishDate: booking.publishDate,
            carSpaceId: booking.parkingSpace,
            vehicleId: booking.vehicle,
            startTime: booking.startTime,
            endTime: booking.endTime,
            cost: booking.totalCost,
            consumer: booking.consumerName,
            consumerEmail: booking.consumerEmail,
            consumerPhone: booking.consumerPhone,
          });
        }

        setBookings(fecthedBookings);
      } catch (e) {
        setError({
          value: true,
          message: config.NETWORK_ERROR_MESSAGE,
        });
      }
    };

    fetchData();
  }, [providerModalContext.carSpaceId]);

  return (
    <div className={classes.body}>
      <CarSpaceCardHeader
        title="Bookings"
        onClose={providerModalContext.closeModal}
        onBack={backToCarSpaceInfoHandler}
      />
      <CarSpaceCardContent>
        {isLoading && (
          <div className={classes["center-container"]}>
            <CircularProgress className={classes.spinner} />
          </div>
        )}
        {!isLoading && !error.value && (
          <GeneralDataGrid
            rows={bookings}
            columns={[
              {
                field: "publishDate",
                headerName: "Date",
                flex: 1,
              },
              {
                field: "startTime",
                headerName: "Start Time",
                flex: 1,
              },
              {
                field: "endTime",
                headerName: "End Time",
                flex: 1,
              },
              {
                field: "cost",
                headerName: "Cost",
                flex: 1,
              },
              {
                field: "consumer",
                headerName: "Consumer",
                flex: 1,
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
        {!isLoading && error.value && (
          <div className={classes["center-container"]}>{error.message}</div>
        )}
      </CarSpaceCardContent>
    </div>
  );
};

export default CarSpaceBookings;
