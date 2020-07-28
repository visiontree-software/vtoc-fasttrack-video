import React, { ChangeEvent, FormEvent, useState, useEffect, useCallback } from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Controls from '../Controls/Controls';

const useStyles = makeStyles(theme => ({
  root: {
    width: '80%',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    width: '100%',
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  videoContainer: {
    position: 'relative',
    // display: 'flex',
    // flex: '0 1 740px',
    minWidth: '448px',
  },
  videoInformation: {
    textAlign: 'center',
    '& div': {
      padding: '2em',
    },
    [theme.breakpoints.down('xs')]: {
      bottom: `${theme.sidebarMobileHeight + 3}px`,
    },
  },
  joinButton: {
    margin: '1em',
  },
}));

export default function LocalVideoPreview() {
  const { isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks, localTracks } = useVideoContext();
  const classes = useStyles();

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = window.sessionStorage.getItem('token');
    //setRoomName('VTOC Video Room');
    //setName('VTOC Patient');
    if (token) {
      connect(token);
    }
  };

  return videoTrack ? (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid container spacing={2} className={classes.innerContainer}>
          <Grid item xs={12} sm={6} lg={7} className={classes.videoContainer}>
            <VideoTrack track={videoTrack} isLocal />
            <Controls />
          </Grid>
          <Grid item xs={12} sm={6} lg={5} className={classes.videoInformation}>
            <div>
              <Typography variant="h5" gutterBottom>
                VTOC FastTrack Video
              </Typography>
              <Typography variant="body1" gutterBottom>
                Please click the "Join Virtual Visit" button below to connect with your medteam provider.
              </Typography>
              <form onSubmit={handleSubmit}>
                <Button
                  className={classes.joinButton}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isAcquiringLocalTracks || isConnecting || isFetching}
                >
                  Join Virtual Visit
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  ) : null;
}
