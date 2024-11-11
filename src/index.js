import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
//import App from "./App";
import Home from "./pages/home/home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
//import Table from './pages/login/table';
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
      <Routes>
      {/* <Route path="/table" element={<Table />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
);
