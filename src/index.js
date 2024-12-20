import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
//import App from "./App";
import Home from "./pages/home/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Table from "./pages/login/table";
import CallBack from "./pages/home/callback";
import GalleryView from "./pages/gallery/galleryView";
import GalleryEditView from "./pages/gallery/galleryEditView";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/table" element={<Table />} />
          <Route path="/call-back" element={<CallBack />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/edit" element={<GalleryEditView />} />
        </Routes>
      </Router>
    </PersistGate>
  </Provider>
);
