import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const fetchToken = () => {
  const match = window.location.search.match(/token=(.*)&?/);
  const token = match ? match[1] : window.sessionStorage.getItem('token');
  console.debug('*** fetchToken result:', token);
  return token;
};

export default function useTokenAuth() {
  const history = useHistory();

  const [user, setUser] = useState<{ displayName: undefined; photoURL: undefined; token: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback(
    (name: string, room: string) => {
      console.debug('*** getToken called');
      const token = fetchToken() || '';
      return Promise.resolve(token);
    },
    [user]
  );

  useEffect(() => {
    const passcode = fetchToken();

    if (passcode) {
      setUser({ passcode } as any);
      window.sessionStorage.setItem('token', passcode);
      history.replace(window.location.pathname);
    }
    setIsAuthReady(true);
  }, [history]);

  const signIn = useCallback((token: string) => {
    window.sessionStorage.setItem('token', token);
    return Promise.resolve();
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem('token');
    return Promise.resolve();
  }, []);

  return { user, isAuthReady, getToken, signIn, signOut };
}
