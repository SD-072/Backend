import { authServiceURL } from '@/utils';
import { createContext, useEffect, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  authLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const refreshLogin = async () => {
      try {
        setAuthLoading(true);
        const refreshRes = await fetch(`${authServiceURL}/refresh`, { method: 'POST' });
        if (!refreshRes.ok) return;
        const userRes = await fetch(`${authServiceURL}/me`);
        if (!userRes.ok) throw new Error('Refreshing Login failed');
        const {
          user: { email, firstName, lastName, roles },
        } = await userRes.json();

        setUser({ email, firstName, lastName, roles });
      } catch (error) {
        console.log(error);
      } finally {
        setAuthLoading(false);
      }
    };
    refreshLogin();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, authLoading }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
