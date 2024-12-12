import * as React from 'react';
import { Box, CircularProgress, ThemeProvider } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { NotificationProvider } from '~/providers/NotificationProvider';
import theme from '~/utils/theme';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ConfirmationProvider } from '~/providers/ConfirmationProvider';
import { ContextProvider } from '~/providers/ContextProvider';
import { UserProvider } from '~/providers/UserProvider';
import { UndoProvider } from '~/providers/UndoProvider';
import { store } from '~/store';
import { BUSINESS_UNITY } from '~/config/constants';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

interface IAppProps {
  context: WebPartContext;
  children: React.ReactNode;
}

const App: React.FC<IAppProps> = ({ context, children }) => {
  const [validToken, setValidToken] = React.useState(false);
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    intervalRef.current = setInterval(() => {
      checkToken();
    }, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  React.useEffect(() => {
    checkToken();
  }, []);

  const getToken = async () => {
    const tokenProvider =
      await context.aadTokenProviderFactory.getTokenProvider();
    const token = await tokenProvider.getToken(
      `https://${BUSINESS_UNITY}.crm2.dynamics.com`
    );

    sessionStorage.setItem('dynamic365Token', token);

    setValidToken(true);
  };

  const checkToken = async () => {
    let token = sessionStorage
      ?.getItem('dynamic365Token')
      ?.replace('undefined', '');

    if (!token) {
      getToken();
    } else {
      const decode = JSON.parse(atob(token?.split('.')[1] || ''));
      const expiry = decode?.exp - 1800;

      if (expiry < new Date().getTime()) {
        getToken();
      } else {
        setValidToken(true);
      }
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ContextProvider context={context}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <NotificationProvider>
                <UndoProvider>
                  {validToken ? (
                    <UserProvider context={context}>
                      <ConfirmationProvider>{children}</ConfirmationProvider>
                    </UserProvider>
                  ) : (
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <CircularProgress color='primary' />
                    </Box>
                  )}
                </UndoProvider>
              </NotificationProvider>
            </MuiPickersUtilsProvider>
          </LocalizationProvider>
        </ContextProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
