import React from 'react';
import clsx from 'clsx';
import { Base64 } from 'js-base64';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';

import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import VideocamOff from '@material-ui/icons/VideocamOff';

import { useAppState } from '../../state';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gridArea: 'participantList',
  },
  isVideoSwitchedOff: {
    '& video': {
      filter: 'blur(4px) grayscale(1) brightness(0.5)',
    },
  },
  identity: {
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '0.1em 0.3em',
    margin: '1em',
    fontSize: '1.2em',
    color: '#fff',
    display: 'inline-flex',
    borderRadius: '4px',
    '& svg': {
      marginLeft: '0.3em',
    },
  },
  infoContainer: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    padding: '0.4em',
    width: '100%',
  },
});

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

async function fetchPartipantName(vtocUrl: string, id: string, room: string): Promise<any | { error: string }> {
  const roomId = room;
  const userId = parseInt(id, 10);

  try {
    const response = await fetch(
      `${vtocUrl}physician/Application/controllers/VideoControllerRemote.cfc?method=getUserName&roomId=` +
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

export default function MainParticipantInfo({ participant, children }: MainParticipantInfoProps) {
  const { user, vtocUrl } = useAppState();

  const classes = useStyles();

  const publications = usePublications(participant);
  const videoPublication = publications.find(p => p.trackName.includes('camera'));
  const screenSharePublication = publications.find(p => p.trackName.includes('screen'));
  const isVideoEnabled = Boolean(videoPublication);

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);
  const {
    room: { localParticipant },
  } = useVideoContext();

  const [participantName, setUsername] = useState('');

  useEffect(() => {
    const userId = user!.identity.toString();
    const participantId = participant.identity;

    if (userId !== participantId) {
      fetchPartipantName(vtocUrl, participant.identity, user!.roomName).then(result => {
        setUsername(`${result.firstName} ${result.lastName}`);
      });
    } else {
      setUsername('You');
    }
  }, [participant, user, vtocUrl]);

  return (
    <div
      data-cy-main-participant
      className={clsx(classes.container, { [classes.isVideoSwitchedOff]: isVideoSwitchedOff })}
    >
      <div className={classes.infoContainer}>
        <h4 className={classes.identity}>
          {participantName}
          {!isVideoEnabled && <VideocamOff />}
        </h4>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
