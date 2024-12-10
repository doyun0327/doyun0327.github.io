// hooks/useGallery.js
import { useDispatch, useSelector } from "react-redux";
import { fetchGalleryData, setSeletedImage } from "../redux/gallerySlice";

// 커스텀 훅
const useGallery = () => {
  const dispatch = useDispatch();
  const { gallery, status, error } = useSelector((state) => state.gallery);

  // 갤러리 데이터를 가져오는 함수
  const loadGalleryData = () => {
    dispatch(fetchGalleryData());
  };

  return {
    gallery,
    status,
    error,
    loadGalleryData,
  };
};
export default useGallery;

export const useEditGallery = () => {
  const dispatch = useDispatch();
  console.log("dispatch");

  return (newState) => {
    dispatch(setSeletedImage(newState)); // dispatch 실행
  };
};
