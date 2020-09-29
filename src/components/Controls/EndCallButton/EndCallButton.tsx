import React, { useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

async function logEndSession(vtocUrl: string, userId: number, roomId: string): Promise<any | { error: string }> {
  try {
    const response = await fetch(
      `${vtocUrl}physician/Application/controllers/VideoControllerRemote.cfc?method=logEndSession&roomId=` +
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

export default function EndCallButton() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { user, vtocUrl } = useAppState();

  const logEndCall = useCallback(() => {
    console.log('handle end call');
    logEndSession(vtocUrl, user!.identity, user!.roomName);
  }, [user, vtocUrl]);

  return (
    <Tooltip
      title={'End Call'}
      onClick={() => {
        logEndCall();
        room.disconnect();
      }}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <Fab className={classes.fab} color="primary">
        <CallEnd />
      </Fab>
    </Tooltip>
  );
}
