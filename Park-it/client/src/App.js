import "./App.css";

import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Consumer from "./components/Consumer/Consumer";
import Provider from "./components/Provider/Provider";
import Account from "./components/Account/Account";

function App() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/consumer/*" element={<Consumer />} />
              <Route path="/provider/*" element={<Provider />} />
              <Route path="/account/*" element={<Account />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
