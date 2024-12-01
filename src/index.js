import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
//import App from "./App";
import Home from "./pages/home/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Table from './pages/login/table';
import  CallBack from "./pages/home/callback";
import store from './store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}> 
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/table" element={<Table />} />
      <Route path="/call-back" element={<CallBack />} />
    </Routes>
  </Router>
  </Provider>
);
