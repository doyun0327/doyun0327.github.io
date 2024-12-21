import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const SuccessAlert = ({ message }) => {
  if (!message) return null;  // 메시지가 없으면 아무것도 렌더링하지 않음
console.log('vv')
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert variant="outlined" severity="success">
        {message}
      </Alert>
    </Stack>
  );
};

export default SuccessAlert;
