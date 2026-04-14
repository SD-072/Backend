import { type ReactNode, useEffect, useState } from 'react';
import { login, logout, me } from '@/data';
import type { AuthContextType, LoginInput, User } from '@/types';
import { AuthContext } from '.';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkSession, setCheckSession] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await me();
        setUser(userData);
        setSignedIn(true);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckSession(false);
      }
    };
    if (checkSession) getUser();
  }, [checkSession]);

  const handleSignIn = async ({ email, password }: LoginInput) => {
    const { accessToken, refreshToken } = await login({ email, password });

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // setSignedIn(true);
    setCheckSession(true);
  };

  const handleSignOut = async () => {
    await logout();

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    setSignedIn(false);
    setUser(null);
  };

  const value: AuthContextType = {
    signedIn,
    user,
    handleSignIn,
    handleSignOut
  };

  return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;
