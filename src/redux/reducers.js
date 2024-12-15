import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import galleryReudcer from "../slice/gallerySlice";

const rootReducer = combineReducers({
  user: userReducer,
  gallery: galleryReudcer,
});

export default rootReducer;
