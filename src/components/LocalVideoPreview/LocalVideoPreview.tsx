import React, { ChangeEvent, FormEvent, useState, useEffect, useCallback } from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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

async function logStartSession(userId: number, roomId: string): Promise<any | { error: string }> {
  try {
    const response = await fetch(
      'https://preview2.optimalcare.com/physician/Application/controllers/VideoControllerRemote.cfc?method=logStartSession&roomId=' +
        roomId +
        '&userId=' +
        userId,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Base64.encode(
            `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`
          )}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.code };
    }
    return await response.json();
  } catch (err) {
    return { error: err };
  }
}

export default function LocalVideoPreview() {
  const { user, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks, localTracks } = useVideoContext();
  const classes = useStyles();
  const userIsPatient = user?.userType === 'patient';

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  console.log({ user });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user!.token) {
      connect(user!.token);
      logStartSession(user!.identity, user!.roomName);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid container spacing={2} className={classes.innerContainer}>
          <Grid item xs={12} sm={6} lg={7} className={classes.videoContainer}>
            {videoTrack && <VideoTrack track={videoTrack} isLocal />}
          </Grid>
          <Grid item xs={12} sm={6} lg={5} className={classes.videoInformation}>
            <div>
              <Typography variant="h5" gutterBottom>
                VTOC FastTrack Video
              </Typography>
              {userIsPatient ? (
                <Typography variant="body1" gutterBottom>
                  Please click the "Join Now" button below to connect with your careteam.
                </Typography>
              ) : (
                <Typography variant="body1" gutterBottom>
                  Please click the "Join Now" button below to connect with your patient.
                </Typography>
              )}
              <form onSubmit={handleSubmit}>
                <Button
                  className={classes.joinButton}
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isAcquiringLocalTracks || isConnecting || isFetching}
                >
                  Join Now
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
