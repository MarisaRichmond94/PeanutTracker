import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6172',
    },
    secondary: {
      main: '#8aa1ae',
    },
    background: {
      default: '#232332',
      paper: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b5ead7',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});
