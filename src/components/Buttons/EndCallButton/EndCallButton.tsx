import React, { useCallback } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { Button } from '@material-ui/core';

import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
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

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const history = useHistory();
  const roomState = useRoomState();
  const { user, vtocUrl, signOut } = useAppState();

  const disconnect = useCallback(() => {
    logEndSession(vtocUrl, user!.identity, user!.roomName);
    room.disconnect();
    signOut?.();
    history.push('/thanks');
  }, [room, signOut, history, vtocUrl, user]);

  return (
    <Button onClick={disconnect} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
  );
}
