import { createTheme } from '@material-ui/core';

export default createTheme({
  palette: {
    primary: {
      main: '#0063a5',
    },
  },
  typography: {
    fontFamily: [
      'Source Sans Pro',
      'sans-serif',
      '"Segoe UI"',
      '"Segoe UI Web (West European)"',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});
