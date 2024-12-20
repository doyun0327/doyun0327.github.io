import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const YesNoModal = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>알림</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          네
        </Button>
        <Button onClick={onClose} color="secondary">
          아니오
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YesNoModal;
