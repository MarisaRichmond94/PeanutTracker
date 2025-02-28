import { x } from '@xstyled/styled-components';
import { PropsWithChildren } from 'react';

import { Header } from './Header.component';
import { Footer } from './Footer.component';
import { Box } from '@mui/material';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        <x.div id='page-content' margin='12px'>
          {children}
        </x.div>
      </Box>
      <Footer />
    </Box>
  );
};
