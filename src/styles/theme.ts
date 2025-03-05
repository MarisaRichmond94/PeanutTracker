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
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#232332',
          color: 'white',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        expandIconWrapper: {
          color: 'white',
        },
        root: {
          backgroundColor: '#232332',
          color: 'white',
          '&.Mui-expanded': {
            backgroundColor: '#232332',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: '#232332',
          color: 'white',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': { color: 'white' },
          '& label.Mui-focused': { color: 'white' },
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: '#b5ead7' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: 'white',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b5ead7' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '& .MuiSvgIcon-root': { color: 'white' },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#333',
          color: 'white',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: 'white',
          '&:hover': { backgroundColor: '#444' },
        },
      },
    },
  },
});
