import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { isNil } from 'lodash';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { auth, googleProvider } from '@firebase';
import { Page } from '@types';

import { useGlobal } from './Global.context';

export type AuthenticationState = {
  user: User | null;

  signInWithGoogle: () => void;
  signOutWithGoogle: () => void;
}

const AuthenticationContext = createContext<AuthenticationState | undefined>(undefined);

export const AuthenticationProvider = ({ children }: PropsWithChildren) => {
  const { setPage } = useGlobal();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      setPage(isNil(user) ? Page.LANDING : Page.HOME);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setPage(Page.HOME);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOutWithGoogle = async () => {
    try {
      await signOut(auth);
      setPage(Page.LANDING);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,

    signInWithGoogle,
    signOutWithGoogle,
  };

  return (
    <AuthenticationContext.Provider {...{ value }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (isNil(context)) throw new Error('useAuthentication must be used within a AuthenticationProvider');
  return context;
};
