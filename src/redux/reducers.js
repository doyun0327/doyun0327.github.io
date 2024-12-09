import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import galleryReudcer from "./gallerySlice";

const rootReducer = combineReducers({
  user: userReducer,
  gallery: galleryReudcer,
});

export default rootReducer;
