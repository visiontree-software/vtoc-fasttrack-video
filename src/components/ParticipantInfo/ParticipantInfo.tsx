import React from 'react';
import clsx from 'clsx';
import { Base64 } from 'js-base64';
import { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import PinIcon from './PinIcon/PinIcon';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';

import { useAppState } from '../../state';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: `${(theme.sidebarWidth * 9) / 16}px`,
      overflow: 'hidden',
      cursor: 'pointer',
      '& video': {
        filter: 'none',
      },
      '& svg': {
        stroke: 'black',
        strokeWidth: '0.8px',
      },
      [theme.breakpoints.down('xs')]: {
        height: theme.sidebarMobileHeight,
        width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
        marginRight: '3px',
        fontSize: '10px',
      },
    },
    isVideoSwitchedOff: {
      '& video': {
        filter: 'blur(4px) grayscale(1) brightness(0.5)',
      },
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      padding: '0.4em',
      width: '100%',
      background: 'transparent',
    },
    hideVideo: {
      background: 'black',
    },
    identity: {
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.1em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

async function fetchPartipantName(id: string, room: string): Promise<any | { error: string }> {
  const roomId = room;
  const userId = parseInt(id, 10);

  try {
    const response = await fetch(
      'https://preview2.optimalcare.com/physician/Application/controllers/VideoControllerRemote.cfc?method=getUserName&roomId=' +
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

export default function ParticipantInfo({ participant, onClick, isSelected, children }: ParticipantInfoProps) {
  const { user } = useAppState();

  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => p.trackName.includes('camera'));

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack;

  const classes = useStyles();

  const [participantName, setUsername] = useState('');

  useEffect(() => {
    const userId = user!.identity;
    const participantId = parseInt(participant.identity, 10);

    if (userId !== participantId) {
      fetchPartipantName(participant.identity, user!.roomName).then(result => {
        setUsername(result.firstName + ' ' + result.lastName);
      });
    } else {
      setUsername('You');
    }
  }, [participant, user]);

  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
      })}
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div className={clsx(classes.infoContainer, { [classes.hideVideo]: !isVideoEnabled })}>
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            <ParticipantConnectionIndicator participant={participant} />
            {participantName}
          </h4>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </div>
        <div>
          <AudioLevelIndicator audioTrack={audioTrack} background="white" />
          {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />}
          {isSelected && <PinIcon />}
        </div>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
