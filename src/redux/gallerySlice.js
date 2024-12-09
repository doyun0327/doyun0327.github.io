import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gallery: [],
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setGalleryData: (state, action) => {
      state.gallery = action.payload;
    },
  },
});

export const { setGalleryData } = gallerySlice.actions;

export default gallerySlice.reducer;
