// redux/gallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGallery } from "../api/services/galleryService"; // GalleryService에서 fetchGallery 가져오기

// 비동기 액션 생성
export const fetchGalleryData = createAsyncThunk(
  "gallery/fetchGalleryData", // 액션 이름
  async () => {
    const galleryData = await fetchGallery(); // fetchGallery 함수 호출
    return galleryData; // 반환된 데이터는 자동으로 state에 저장됨
  }
);

const initialState = {
  gallery: [],
  status: "idle", // 로딩 상태
  error: null, // 에러 상태
  seletedImage: "",
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setSeletedImage: (state, action) => {
      console.log("action.payload", action.payload);
      state.seletedImage = action.payload; // action.payload는 이미지 이름 문자열
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGalleryData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.gallery = action.payload; // 응답 데이터 저장
      })
      .addCase(fetchGalleryData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // 에러 메시지 저장
      });
  },
});

export const { setSeletedImage } = gallerySlice.actions;
export default gallerySlice.reducer;
