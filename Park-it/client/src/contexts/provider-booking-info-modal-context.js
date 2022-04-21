import React, { useState } from "react";

const ProviderBookingInfoModalContext = React.createContext({
  page: "",
  carSpaceId: null,
  carSpaceInfo: { images: [], fetched: false },
  isOpen: false,
  carSpacesRefreshStatus: false,
  bookingInfo: { images: [] },
  // bookingInfo: {
  //   userInfo: {
  //     username: "",
  //     email: "",
  //     mobile: "",
  //   },
  // },
  toggleCarSpacesRefreshStatus: () => {},
  openPage: () => {},
  closeModal: () => {},
  fetchCarSpaceInfo: () => {},
  setBookingInfo: () => {},
});

export const ProviderBookingInfoModalContextProvider = (props) => {
  const [carSpaceInfo, setCarSpaceInfo] = useState({
    images: [],
    fetched: false,
  });
  const [carSpaceId, setCarSpaceId] = useState("");
  const [page, setPage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [carSpacesRefreshStatus, setCarSpacesRefreshStatus] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ images: [] });
  // const [bookingInfo, setBookingInfo] = useState({
  //   userInfo: {
  //     username: "",
  //     email: "",
  //     mobile: "",
  //   },
  // });

  const resetContextValue = () => {
    setCarSpaceInfo({ images: [], fetched: false });
    setCarSpaceId("");
    setPage("");
  };

  const openPage = (path, csId = null) => {
    if (!isOpen) setIsOpen(true);
    setPage(path);

    if (!csId) return;
    setCarSpaceId(csId);
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
    <ProviderBookingInfoModalContext.Provider value={contextValue}>
      {props.children}
    </ProviderBookingInfoModalContext.Provider>
  );
};

export default ProviderBookingInfoModalContext;
