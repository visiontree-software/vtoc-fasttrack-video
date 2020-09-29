import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';

const getDecodedAccessToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (Error) {
    return null;
  }
};

export const fetchUserParams = () => {
  let params = new URLSearchParams(window.location.search);
  let identity;
  let roomName;

  const token = params.get('token') || window.sessionStorage.getItem('token') || '';
  const userType = params.get('userType') || window.sessionStorage.getItem('userType') || '';
  const region = params.get('region') || window.sessionStorage.getItem('region') || '';
  const env = params.get('env') || window.sessionStorage.getItem('env') || '';

  if (token !== '') {
    const decoded = getDecodedAccessToken(token);

    identity = decoded.grants.identity;
    roomName = decoded.grants.video.room;

    window.sessionStorage.setItem('identity', identity);
    window.sessionStorage.setItem('roomName', roomName);
  }

  for (var pair of params.entries()) {
    window.sessionStorage.setItem(pair[0], pair[1]);
  }

  return { token, identity, roomName, userType, region, env };
};

export default function useTokenAuth() {
  const history = useHistory();
  const [vtocUrl, setVtocUrl] = useState('https://optimalcare.com/');

  const [user, setUser] = useState<{
    token: string;
    identity: number;
    roomName: string;
    userType: string;
  } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback((name: string, room: string) => {
    console.debug('*** getToken called');
    const token = fetchUserParams().token;
    return Promise.resolve(token);
  }, []);

  useEffect(() => {
    const userInfo = fetchUserParams();
    const vtocUrlToUse = `REACT_APP_VTOC_${userInfo.region}_${userInfo.env}_URL`;

    // set vtoc api url to use based on region/env
    setVtocUrl(`${process.env[vtocUrlToUse]}`);

    if (userInfo.token !== '') {
      setUser({ ...userInfo } as any);
      history.replace(window.location.pathname);
      //history.push('/virtual-visit');
    }
    setIsAuthReady(true);
  }, [vtocUrl, history]);

  const signIn = useCallback((token: string) => {
    window.sessionStorage.setItem('token', token);
    return Promise.resolve();
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    // window.sessionStorage.clear();
    return Promise.resolve();
  }, []);

  return { user, isAuthReady, getToken, signIn, signOut, vtocUrl };
}
