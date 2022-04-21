import React, { useState } from "react";

const ProviderModalContext = React.createContext({
  page: "",
  carSpaceId: null,
  carSpaceInfo: { images: [], fetched: false },
  isOpen: false,
  carSpacesRefreshStatus: false,
  bookingInfo: { images: [] },
  toggleCarSpacesRefreshStatus: () => {},
  openPage: () => {},
  closeModal: () => {},
  fetchCarSpaceInfo: () => {},
  setBookingInfo: () => {},
});

export const ProviderModalContextProvider = (props) => {
  const [carSpaceInfo, setCarSpaceInfo] = useState({
    images: [],
    fetched: false,
  });
  const [carSpaceId, setCarSpaceId] = useState("");
  const [page, setPage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [carSpacesRefreshStatus, setCarSpacesRefreshStatus] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ images: [] });

  const resetContextValue = () => {
    setCarSpaceInfo({ images: [], fetched: false });
    setCarSpaceId("");
    setPage("");
  };

  const openPage = (path, csId = null) => {
    if (csId) setCarSpaceId(csId);
    setPage(path);
    if (!isOpen) setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetContextValue();
  };

  const toggleCarSpacesRefreshStatus = () => {
    setCarSpacesRefreshStatus(!carSpacesRefreshStatus);
  };

  const fetchCarSpaceInfo = (info) => {
    setCarSpaceInfo({ ...info, fetched: true });
  };

  const contextValue = {
    carSpaceInfo,
    carSpaceId,
    page,
    isOpen,
    carSpacesRefreshStatus,
    bookingInfo,
    toggleCarSpacesRefreshStatus,
    openPage,
    closeModal,
    fetchCarSpaceInfo,
    setBookingInfo,
  };

  return (
    <ProviderModalContext.Provider value={contextValue}>
      {props.children}
    </ProviderModalContext.Provider>
  );
};

export default ProviderModalContext;
