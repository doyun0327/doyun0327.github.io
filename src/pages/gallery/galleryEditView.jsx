import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import api from '../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSeletedGallery } from '../../slice/gallerySlice'; // 수정된 이미지를 리덕스에 저장하는 액션
import SuccessAlert from '../../common/successAlert';

function GalleryEditView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const seletedImage = useSelector((state) => state.gallery.seletedGallery.image);
  const seletedText = useSelector((state) => state.gallery.seletedGallery.text);
  const [imagePreview, setImagePreview] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  // 처음에 수정하려는 이미지가 있을 경우 미리보기 설정
  useEffect(() => {
    if (seletedImage) {
      setImagePreview(`http://localhost:4000/images/${seletedImage}`);
    }
  }, [seletedImage]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('image', values.image); // 새 이미지 추가
    formData.append('text', values.text);   // 새 텍스트 추가
  
    try {
      // 기존 이미지를 삭제하고 새 이미지와 텍스트로 교체하는 요청
      const response = await api.put(`http://localhost:4000/edit/${seletedImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        setAlertMessage('성공적으로 작업을 완료했습니다!');
        // 업로드 후 상태 초기화
        dispatch(setSeletedGallery({ image: null, text: '' }));
      // 알림이 표시된 후 페이지 전환
      setTimeout(() => {
        navigate('/gallery');
      }, 1000);  // 2초 후에 페이지 전환
      } else {
        alert('이미지 수정 실패!');
      }
    } catch (error) {
      alert('오류가 발생했습니다!');
      console.error(error);
    }
  
    setSubmitting(false);
  };
  
  return (
    <div style={styles.container}>

{alertMessage && <SuccessAlert message={alertMessage} />}
      <Formik
        initialValues={{ text: seletedText, image: null }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="text" style={styles.inputLabel}>텍스트</label>
              <Field
                type="text"
                name="text"
                placeholder="텍스트를 입력하세요"
                style={styles.input}
              />
              <ErrorMessage name="text" component="div" style={styles.errorMessage} />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="image" style={styles.inputLabel}>이미지 업로드</label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={styles.imagePreview}
                />
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue('image', event.currentTarget.files[0]);
                  // 이미지 미리보기 업데이트
                  const file = event.currentTarget.files[0];
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={styles.fileInput}
              />
              <ErrorMessage name="image" component="div" style={styles.errorMessage} />
            </div>

            <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? '업로드 중...' : '수정'}
            </button>
          </Form>
        )}
      </Formik>

      <button
        onClick={() => navigate('/gallery')}
        style={styles.navigateButton}
      >
        게시판 바로가기
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1c1c1c',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '300px',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },

  inputLabel: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#ccc',
  },

  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #555',
    borderRadius: '5px',
    backgroundColor: '#444',
    color: '#fff',
    marginBottom: '10px',
  },

  fileInput: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #555',
    borderRadius: '5px',
    backgroundColor: '#444',
    color: '#fff',
    marginBottom: '10px',
  },

  imagePreview: {
    width: '100px',
    margin: '10px 0',
  },

  submitButton: {
    backgroundColor: '#ffc800',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },

  navigateButton: {
    backgroundColor: '#00bfff',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
};

export default GalleryEditView;
