import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const fetchUserParams = () => {
  let params = new URLSearchParams(window.location.search);

  const token = params.get('token') || '';
  const userId = params.get('userId') || '';
  const userType = params.get('userType') || '';

  for (var pair of params.entries()) {
    window.sessionStorage.setItem(pair[0], pair[1]);
  }

  console.debug('*** fetchUserParams result:', token);
  return { token, userId, userType };
};

export default function useTokenAuth() {
  const history = useHistory();

  const [user, setUser] = useState<{ displayName: undefined; photoURL: undefined; token: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback((name: string, room: string) => {
    console.debug('*** getToken called');
    const token = fetchUserParams().token;
    return Promise.resolve(token);
  }, []);

  useEffect(() => {
    const userInfo = fetchUserParams();

    if (userInfo.token) {
      setUser({ userInfo } as any);
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
    window.sessionStorage.clear();
    return Promise.resolve();
  }, []);

  return { user, isAuthReady, getToken, signIn, signOut };
}
