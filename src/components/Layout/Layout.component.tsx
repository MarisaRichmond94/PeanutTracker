import { Box } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { PropsWithChildren, useState } from 'react';

import { useGlobal } from '@contexts';
import { Page } from '@types';

import { Footer } from './Footer.component';
import { Header } from './Header.component';
import { HeaderMenu } from './HeaderMenu.component';
import { SectionHeader } from './SectionHeader.component';

export const Layout = ({ children }: PropsWithChildren) => {
  const { page } = useGlobal();

  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  const getIsMenuLayout = () => {
    switch (page) {
      case Page.NOTES:
      case Page.PROFILE:
      case Page.TRENDS:
        return true;
      default:
        return false;
    }
  };

  if (showHeaderMenu) return <HeaderMenu setShowHeaderMenu={setShowHeaderMenu} />;

  if (getIsMenuLayout()) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
        <x.div display='flex' flexDirection='column' gap='20px' padding='20px'>
          <SectionHeader onClick={() => setShowHeaderMenu(true)} text={page.charAt(0).toUpperCase() + page.slice(1)} />
        </x.div>
        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
          <x.div id='page-content' margin='0 20px'>
            {children}
          </x.div>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <Header showHeaderMenu={showHeaderMenu} setShowHeaderMenu={setShowHeaderMenu} />
      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        <x.div id='page-content' margin='12px'>
          {children}
        </x.div>
      </Box>
      <Footer />
    </Box>
  );
};
