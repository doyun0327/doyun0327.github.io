import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // {"id":"test","name":"테스트"} console.log("rr" + JSON.stringify(action.payload));
      // 로그인 후 user 정보를 설정
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    logout: (state) => {
      // 로그아웃 시 user 정보 초기화
      state.id = null;
      state.name = null;
    },
  },
});

// 액션 생성 함수 내보내기
export const { setUser, logout } = userSlice.actions;

// 리듀서 내보내기
export default userSlice.reducer;
