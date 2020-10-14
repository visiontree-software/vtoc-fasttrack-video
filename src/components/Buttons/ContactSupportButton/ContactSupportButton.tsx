import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';

import useRoomState from '../../../hooks/useRoomState/useRoomState';
import ContactSupportDialog from '../../ContactSupportDialog/ContactSupportDialog';
import { useAppState } from '../../../state';

const useStyles = makeStyles((theme: Theme) => ({
  settingsButton: {
    margin: '1.8em 0 0',
  },
}));

export default function ContactSupportButton({ mobileButtonClass }: { mobileButtonClass?: string }) {
  const classes = useStyles();
  const { roomType } = useAppState();
  const roomState = useRoomState();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [supportOpen, setSupportOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {isMobile ? (
        <Button
          ref={anchorRef}
          onClick={() => setSupportOpen(true)}
          startIcon={<HelpIcon />}
          className={mobileButtonClass}
        >
          Support
        </Button>
      ) : (
        <Button
          ref={anchorRef}
          onClick={() => setSupportOpen(true)}
          startIcon={<HelpIcon />}
          className={clsx({ [classes.settingsButton]: roomState === 'disconnected' })}
        >
          Support
        </Button>
      )}
      <ContactSupportDialog
        open={supportOpen}
        onClose={() => {
          setSupportOpen(false);
        }}
      />
    </>
  );
}
