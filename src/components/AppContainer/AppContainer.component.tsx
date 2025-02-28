import { CssBaseline, ThemeProvider } from '@mui/material';
// import { Preflight } from '@xstyled/styled-components';
import { PropsWithChildren } from 'react';
// import { ThemeProvider } from 'styled-components';

import { AuthenticationProvider, GlobalProvider } from '@contexts';
import { theme } from '@styles';

export const AppContainer = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalProvider>
      <AuthenticationProvider>
        {children}
      </AuthenticationProvider>
    </GlobalProvider>
  </ThemeProvider>
);
