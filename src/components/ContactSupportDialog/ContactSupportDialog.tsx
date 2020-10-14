import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';

import { useAppState } from '../../state';

interface ContactSupportDialogProps {
  open: boolean;
  onClose(): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    padding: '1.5em',
  },
  settingsButton: {
    //margin: '1em 0',
  },
}));

function ContactSupportDialog({ open, onClose }: PropsWithChildren<ContactSupportDialogProps>) {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <DialogTitle>Support</DialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          <b>Need help?</b> If you have scheduling questions, please contact your Care Team directly.
        </DialogContentText>
        <DialogContentText>
          For any technical questions, please click the "Contact Support" button below or contact support at (877)
          711-VTOC x3.
        </DialogContentText>
        <Button
          target="_blank"
          href="https://optimalcare.com/#support"
          variant="contained"
          color="primary"
          className={classes.settingsButton}
        >
          Contact Support
        </Button>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ContactSupportDialog;
