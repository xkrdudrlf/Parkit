import classes from "./Provider.module.css";

import { Route, Routes } from "react-router-dom";

import { ProviderModalContextProvider } from "../../contexts/provider-modal-context";

import ProviderModal from "./ProviderModal/ProviderModal";
import ProviderListView from "./ProviderListView/ProviderListView";
import ProviderMapView from "./ProviderMapView/ProviderMapView";
import { SubModalContextProvider } from "../../contexts/submodal-context";
import { useEffect } from "react";

const Provider = () => {
  useEffect(() => {
    document.title = "Provider View";
  }, []);
  return (
    <ProviderModalContextProvider>
      <div className={classes.body}>
        <SubModalContextProvider>
          <ProviderModal />
        </SubModalContextProvider>
        <Routes>
          {/* List View */}
          <Route
            path="listView/active/*"
            element={<ProviderListView status={"approved"} />}
          />
          <Route
            path="listView/pending/*"
            element={<ProviderListView status={"pending"} />}
          />
          <Route
            path="listView/rejected/*"
            element={<ProviderListView status={"rejected"} />}
          />
          <Route
            path="listView/cancelled/*"
            element={<ProviderListView status={"cancelled"} />}
          />
          {/* Map View */}
          <Route
            path="mapView/active/*"
            element={<ProviderMapView status={"approved"} />}
          />
          <Route
            path="mapView/pending/*"
            element={<ProviderMapView status={"pending"} />}
          />
          <Route
            path="mapView/rejected/*"
            element={<ProviderMapView status={"rejected"} />}
          />
          <Route
            path="mapView/cancelled/*"
            element={<ProviderMapView status={"cancelled"} />}
          />
        </Routes>
      </div>
    </ProviderModalContextProvider>
  );
};

export default Provider;
