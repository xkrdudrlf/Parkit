import { useContext, useEffect, useState } from "react";

import ProviderModalContext from "../../../../contexts/provider-modal-context";

import CarSpaceInfo from "../../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfo";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

const ProviderCarSpaceInfo = ({ status }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const providerModalContext = useContext(ProviderModalContext);

  const editListHandler = () => {
    providerModalContext.openPage("/edit");
  };

  const viewBookingsHandler = () => {
    providerModalContext.openPage("/bookings");
  };

  const closeCarSpaceInfoHandler = () => {
    providerModalContext.closeModal();
  };

  const bookingAction = {
    content: "View Bookings",
    color: "primary",
    onClick: viewBookingsHandler,
  };

  const editAction = {
    content: "Edit Listings",
    color: "secondary",
    onClick: editListHandler,
  };

  const actions = ["active", "pending"].includes(status)
    ? [bookingAction, editAction]
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (providerModalContext.carSpaceInfo.fetched) return;

        const authToken = localStorage.getItem("parkItAuthToken");
        const url = `${config.SERVER_URL}/api/provider/parking/${providerModalContext.carSpaceId}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await utility.sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        providerModalContext.fetchCarSpaceInfo(response.data);
      } catch (e) {
        setIsLoading(false);
        setError(true);
      }
    };
    fetchData();
  }, [providerModalContext, setIsLoading]);

  return (
    <CarSpaceInfo
      title={`${providerModalContext.carSpaceInfo.streetAddress}, ${providerModalContext.carSpaceInfo.city}`}
      actions={actions}
      isLoading={isLoading}
      error={error}
      setError={setError}
      onClose={closeCarSpaceInfoHandler}
      // onClose={providerModalContext.closeModal}
      modalContext={providerModalContext}
    />
  );
};

export default ProviderCarSpaceInfo;
