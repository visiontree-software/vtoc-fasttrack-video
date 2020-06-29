import React from 'react';
import { useEffect, useState } from 'react';
import { Base64 } from 'js-base64';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

interface ParticipantProps {
  username?: string;
  participant: IParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  isSelected: boolean;
}

async function fetchPartipantName(id: string): Promise<any | { error: string }> {
  const roomId = sessionStorage.getItem('roomId');
  const userId = Number(sessionStorage.getItem('userId'));

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

export default function Participant({
  username,
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  isSelected,
}: ParticipantProps) {
  const [participantName, setUsername] = useState(username || '');

  useEffect(() => {
    if (!username) {
      fetchPartipantName(participant.identity).then(result => {
        setUsername(result.firstName + ' ' + result.lastName);
      });
    }
  }, [username, participant]);

  return (
    <ParticipantInfo username={participantName} participant={participant} onClick={onClick} isSelected={isSelected}>
      <ParticipantTracks participant={participant} disableAudio={disableAudio} enableScreenShare={enableScreenShare} />
    </ParticipantInfo>
  );
}
