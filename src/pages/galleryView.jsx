import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  useGallery  from '../hooks/useGallery';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { useEditGallery } from '../hooks/useGallery';
import { useSelector } from 'react-redux';

const GalleryView = () => {
  const { gallery, status, error, loadGalleryData } = useGallery();
  const navigate = useNavigate();
  const editGallery = useEditGallery();
  // const selet = useSelector((state)=>state.gallery.seletedImage)

  useEffect(()=>{
    loadGalleryData();
  },[])

  if (status === "loading") {
    return <div>로딩 중...</div>;
  }

  if (status === "failed") {
    return <div>에러 발생: {error}</div>;
  }


  const handleDelete = async(image) =>{
    try {
      const response = await axios.delete(`http://localhost:4000/gallery/${image}`);
      if (response.status === 200) {
        alert('삭제 성공');
        loadGalleryData();  // 삭제 후 갤러리 데이터 다시 로드
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 실패");
    }
  }

  const goHome = () =>{
   navigate('/home')
  }
  

  const handleEdit = async(item)=>{
      editGallery(item);  // Execute only if image is valid
        navigate("/home");
  }

  return (
    <div style={styles.galleryContainer}>
      <h1 style={styles.heading}>Image Gallery</h1>
      <div style={styles.gallery}>
        {gallery?.length > 0 ? (
          gallery.map((item, index) => (
            <div key={index} style={styles.imageItem}>
              <img
                src={`http://localhost:4000/images/${item.image}`}
                alt={item.image}
                style={styles.image}
              />
              <p>{item.text}<CiEdit onClick={()=>handleEdit(item)}></CiEdit></p>
          
              <button   style={styles.editButton}  onClick={() => handleDelete(item.image)}>삭제</button>
            </div>
          ))
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      <div><button style={styles.home} onClick={()=>goHome()}>홈</button></div>
    </div>
  );
};

const styles = {
  galleryContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '0',
    listStyle: 'none',
  },
  imageItem: {
    overflow: 'hidden',
    border: '2px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  editButton: {
    // display:"flex",
    // alignItems:"flex-end",
    // backgroundColor: "red",
    // border: "none",
    // color: "#fff",
    // padding: "5px 10px",
    // cursor: "pointer",
    // borderRadius: "5px",
    // zIndex: "100", // 버튼이 다른 요소들 위에 표시되도록 설정
    top: "10px",          // 상단에서 10px 아래
    right: "10px",        // 오른쪽에서 10px 안쪽으로 배치
    backgroundColor: "red",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
    zIndex: "100",      
    marginBottom:"3px"
  },
  home:{
    // display: "flex  !import",
    // justifyContent: "flex-end !import" // 오타 수정
    marginTop:"10px",
    justifyContent: "center", // 버튼 내용 중앙 정렬
    alignItems: "center", // 버튼 내용 세로로 중앙 정렬
    backgroundColor: "#FFA500", // 파스텔톤 주황색
    color: "#fff", // 텍스트 색상 흰색
    border: "none", // 테두리 제거
    borderRadius: "8px", // 버튼 모서리 둥글게
    padding: "10px 20px", // 충분한 여백
    fontSize: "16px", // 적당한 폰트 크기
    cursor: "pointer", // 커서 모양을 손가락 모양으로 변경
    transition: "background-color 0.3s ease", // 배경색 전환 애니메이션
  }
  
};

export default GalleryView;
