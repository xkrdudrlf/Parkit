import React, { useState } from "react";

const ConsumerModalContext = React.createContext({
  page: "",
  favourite: { id: null, value: false },
  carSpaceId: "",
  carSpaceInfo: { images: [], fetched: false },
  searchDate: { startDate: "", endDate: "" },
  isOpen: false,
  pageRefreshStatus: false,
  togglePageRefreshStatus: () => {},
  openPage: () => {},
  closeModal: () => {},
  fetchCarSpaceInfo: () => {},
  setFavourite: () => {},
  backToInfo: () => {},
  setSearchDate: () => {},
});

export const ConsumerModalContextProvider = (props) => {
  const [page, setPage] = useState("");
  const [carSpaceInfo, setCarSpaceInfo] = useState({
    images: [],
    fetched: false,
  });
  const [carSpaceId, setCarSpaceId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pageRefreshStatus, setPageRefreshStatus] = useState(false);
  const [favourite, setFavourite] = useState({ id: null, value: false });
  const [searchDate, setSearchDate] = useState({ startDate: "", endDate: "" });

  const resetContextValue = () => {
    setCarSpaceInfo({ images: [], fetched: false });
    setCarSpaceId("");
    setFavourite({ id: null, value: false });
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

  const togglePageRefreshStatus = () => {
    setPageRefreshStatus((prev) => !prev);
  };

  const fetchCarSpaceInfo = (info) => {
    setCarSpaceInfo({ ...info, fetched: true });
  };

  const backToInfo = () => {
    setPage("/info");
  };

  const contextValue = {
    page,
    favourite,
    carSpaceId,
    carSpaceInfo,
    isOpen,
    pageRefreshStatus,
    searchDate,
    fetchCarSpaceInfo,
    openPage,
    closeModal,
    togglePageRefreshStatus,
    setFavourite,
    backToInfo,
    setSearchDate,
  };

  return (
    <ConsumerModalContext.Provider value={contextValue}>
      {props.children}
    </ConsumerModalContext.Provider>
  );
};

export default ConsumerModalContext;
