import { isNil } from 'lodash';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { Page } from '@types';

export type GlobalState = {
  page: Page;

  setPage: (page: Page) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  const [page, setPage] = useState<Page>(Page.LANDING);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialPage = (params.get('view') as Page) || Page.LANDING;
    setPage(initialPage);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('view', page);
    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [page]);

  const value = {
    page,

    setPage,
  };

  return (
    <GlobalContext.Provider {...{ value }}>
      {children}
    </GlobalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (isNil(context)) throw new Error('useGlobal must be used within a GlobalProvider');
  return context;
};
