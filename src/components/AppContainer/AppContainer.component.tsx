import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PropsWithChildren } from 'react';

import { AuthenticationProvider, GlobalProvider, ProfileProvider } from '@contexts';
import { theme } from '@styles';

export const AppContainer = ({ children }: PropsWithChildren) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalProvider>
        <AuthenticationProvider>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </AuthenticationProvider>
      </GlobalProvider>
    </ThemeProvider>
  </LocalizationProvider>
);
