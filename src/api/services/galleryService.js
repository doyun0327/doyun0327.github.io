import axios from "axios";

export const fetchGallery = async () => {
  try {
    const response = await axios.get("http://localhost:4000/gallery");
    return response.data.gallery; // 서버에서 받은 데이터를 반환
  } catch (error) {
    console.error("갤러리 데이터를 가져오는 데 오류가 발생했습니다.", error);
    throw error; // 에러를 던져서 thunk에서 처리할 수 있도록 함
  }
};
