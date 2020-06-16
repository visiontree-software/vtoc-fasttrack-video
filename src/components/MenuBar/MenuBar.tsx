import React, { ChangeEvent, FormEvent, useState, useEffect, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from './Menu/Menu';
import { ReactComponent as VTOCLogo } from './logo.svg';

import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography } from '@material-ui/core';
import FlipCameraButton from './FlipCameraButton/FlipCameraButton';
import LocalAudioLevelIndicator from './DeviceSelector/LocalAudioLevelIndicator/LocalAudioLevelIndicator';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    toolbar: {
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      // [theme.breakpoints.up('md')]: {
      //   marginLeft: '2.2em',
      // },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      maxWidth: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
    vtocLogo: {
      width: '11rem',
      display: 'block',
    },
    exitButton: {
      marginLeft: '.5em',
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { URLRoomName } = useParams();
  const { user, getToken, isFetching, signOut } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();
  const { room, localTracks } = useVideoContext();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
  }, [URLRoomName]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = window.sessionStorage.getItem('token');
    setRoomName('VTOC Video Room');
    setName('VTOC Patient');
    if (token) {
      connect(token);
    }
  };

  const handleSignOut = useCallback(() => {
    console.log('handle signout');
    room.disconnect?.();
    localTracks.forEach(track => track.stop());
    signOut?.();
  }, [localTracks, room.disconnect, signOut]);

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar className={classes.toolbar}>
        <VTOCLogo className={classes.vtocLogo} />
        {roomState === 'disconnected' ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            <Button
              className={classes.joinButton}
              type="submit"
              color="primary"
              variant="contained"
              disabled={isAcquiringLocalTracks || isConnecting || isFetching}
            >
              Join Virtual Visit
            </Button>
            {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
          <h3>{roomName}</h3>
        )}
        <div className={classes.rightButtonContainer}>
          {/* <FlipCameraButton /> */}
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
          <Menu />

          <Button className={classes.exitButton} variant="contained" color="primary" onClick={handleSignOut}>
            Exit Virtual Visit
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
