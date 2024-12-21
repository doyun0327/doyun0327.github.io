import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { useSelector } from 'react-redux';
import api from "../../api/api";
import Modal  from '../../common/modal';
import YesNoModal from '../../common/yesNoModal';
import useGallery from '../../hooks/useGallery';
import { useEditGallery } from '../../hooks/useGallery';
import SuccessAlert from '../../common/successAlert';

const GalleryView = () => {
  const { gallery, status, error, loadGalleryData } = useGallery();
  const navigate = useNavigate();
  const editGallery = useEditGallery();
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [imageToDelete, setImageToDelete] = useState(null); // 삭제할 이미지 상태 추가
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    loadGalleryData();
  }, []);

  if (status === "loading") {
    return <div>로딩 중...</div>;
  }

  if (status === "failed") {
    return <div>에러 발생: {error}</div>;
  }

  const handleDelete = (image) => {
    // 삭제할 이미지를 상태에 저장하고 모달을 연다
    setImageToDelete(image);
    setModalMessage('정말 삭제 하시겠습니까?');
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete) {
      try {
        const response = await api.delete(`http://localhost:4000/gallery/${imageToDelete}`);
        if (response.status === 200) {
          setOpenModal(false);  // 삭제 성공 후 모달 닫기
          setAlertMessage('삭제가 완료되었습니다.');
          
          // 일정 시간 후 알림 메시지를 초기화
          setTimeout(() => {
            setAlertMessage('');
          }, 2000);  // 3초 후 알림 메시지를 초기화
  
          loadGalleryData();  // 갤러리 데이터 다시 로드

        }
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 실패");
        setModalMessage('삭제 실패');
        setOpenModal(true);  // 실패 시에도 모달 열기
      }
    }
  };

  const handleClose = () => {
    setOpenModal(false);  // 모달 닫기
  };

  const goHome = () => {
    navigate('/home');
  };

  const handleEdit = (item) => {
    editGallery(item);  
    navigate("/edit");
  };

  return (
    <div style={styles.galleryContainer}>
      {/* 삭제 확인 모달 */}
      <YesNoModal 
        open={openModal} 
        onClose={handleClose} 
        onConfirm={handleConfirmDelete} 
        message={modalMessage} 
      />

      
    {alertMessage && <SuccessAlert message={alertMessage} />}

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
              <p>{item.text}<CiEdit onClick={() => handleEdit(item)} /></p>
              <button style={styles.editButton} onClick={() => handleDelete(item.image)}>삭제</button>
            </div>
          ))
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      <div><button style={styles.home} onClick={goHome}>홈</button></div>
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
    backgroundColor: "red",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
    zIndex: "100",
    marginBottom: "3px"
  },
  home: {
    marginTop: "10px",
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#FFA500", 
    color: "#fff", 
    border: "none", 
    borderRadius: "8px", 
    padding: "10px 20px", 
    fontSize: "16px", 
    cursor: "pointer", 
    transition: "background-color 0.3s ease", 
  }
};

export default GalleryView;
