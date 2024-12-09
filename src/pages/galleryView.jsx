import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GalleryView = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:4000/gallery')
      .then((response) => {
        setGalleryData(response.data.gallery);
        setLoading(false);
      })
      .catch((error) => {
        console.error('이미지와 텍스트 데이터를 가져오는 데 오류가 발생했습니다.', error);
        setError('이미지와 텍스트 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleEditClick =() =>{
    alert('수정')
  }

  return (
    <div style={styles.galleryContainer}>
      <h1 style={styles.heading}>Image Gallery</h1>
      <div style={styles.gallery}>
        {galleryData.length > 0 ? (
          galleryData.map((item, index) => (
            <div key={index} style={styles.imageItem}>
              <img
                src={`http://localhost:4000/images/${item.image}`}
                alt={item.image}
                style={styles.image}
              />
              <p>{item.text}</p> {/* 텍스트 표시 */}
              <button   style={styles.editButton}  onClick={() => handleEditClick(index)}>수정</button>
            </div>
          ))
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>
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
  
};

export default GalleryView;
