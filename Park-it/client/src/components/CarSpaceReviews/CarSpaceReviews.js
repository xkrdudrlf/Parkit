import classes from "./CarSpaceReviews.module.css";

import * as config from "../../config";
import * as utility from "../../utility";

import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";

import CarSpaceCardHeader from "../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardHeader";
import CarSpaceCardContent from "../UI/CarSpaceUI/CarSpaceCard/CarSpaceCardContent";
import GeneralDataGrid from "../UI/GeneralDataGrid/GeneralDataGrid";

const CarSpaceReviews = ({ modalContext, subModalContext }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    value: false,
    message: "",
  });

  const backToCarSpaceInfoHandler = () => {
    modalContext.openPage("/info");
  };

  const clickReviewRowHandler = (rowData) => {
    subModalContext.openModal({
      title: "Review Message",
      messages: [rowData.row.comment],
      actions: [
        {
          color: "primary",
          onClick: subModalContext.closeModal,
          content: "OK",
          width: "120px",
        },
      ],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("parkItAuthToken");
        const url = `${config.SERVER_URL}/api/provider/parking/reviews/${modalContext.carSpaceId}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await utility.sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        const newReviews = [];
        for (const review of response.data) {
          newReviews.push({
            id: review.pk,
            consumer: review.consumer,
            rating: review.rating,
            comment: review.comment,
            publishDate: review.publishDate,
          });
        }

        setReviews(newReviews);
      } catch (e) {
        console.log(e.message);
        setError({
          value: true,
          message: config.NETWORK_ERROR_MESSAGE,
        });
      }
    };

    fetchData();
  }, [modalContext.carSpaceId]);

  return (
    <div className={classes.body}>
      <CarSpaceCardHeader
        title="Reviews"
        onClose={modalContext.closeModal}
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
            rows={reviews}
            columns={[
              {
                field: "publishDate",
                headerName: "Date",
                width: 180,
              },
              {
                field: "rating",
                headerName: "Rating",
                width: 150,
              },
              {
                field: "comment",
                headerName: "Review",
                flex: 1,
              },
              {
                field: "consumer",
                headerName: "Consumer",
                width: 150,
              },
            ]}
            rowsPerPageOptions={[5, 10]}
            onRowClick={clickReviewRowHandler}
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
            helperText={"* Click a row to see the details of a review"}
          />
        )}
        {!isLoading && error.value && (
          <div className={classes["center-container"]}>{error.message}</div>
        )}
      </CarSpaceCardContent>
    </div>
  );
};

export default CarSpaceReviews;
