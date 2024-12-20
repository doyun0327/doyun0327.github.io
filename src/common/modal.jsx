import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';


const modal = ({open,onClose,message }) =>{
    return(
    <Dialog open = {open} onClose={onClose}>
        <DialogTitle>알림</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          네
        </Button>
      </DialogActions>
    </Dialog>)
}

export default modal;
